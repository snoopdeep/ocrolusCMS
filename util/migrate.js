import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import MigrationRunner from '../migrations/migration-runner.js';

const runMigrations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to database');

    const runner = new MigrationRunner();
    
    const command = process.argv[2];
    
    switch (command) {
      case 'up':
        await runner.runMigrations();
        break;
      case 'down':
        const version = process.argv[3];
        if (!version) {
          console.error('Please provide migration version to rollback');
          process.exit(1);
        }
        await runner.rollback(version);
        break;
      case 'status':
        const migrations = await runner.getStatus();
        console.log('\nMigration Status:');
        console.table(migrations.map(m => ({
          Version: m.version,
          Name: m.name,
          Status: m.status,
          'Executed At': m.executedAt?.toISOString()
        })));
        break;
      default:
        console.log('Usage:');
        console.log('  npm run migrate up     - Run all pending migrations');
        console.log('  npm run migrate down <version> - Rollback specific migration');
        console.log('  npm run migrate status  - Show migration status');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runMigrations();