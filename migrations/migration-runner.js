import mongoose from 'mongoose';
import Migration from '../models/migration.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MigrationRunner {
  constructor() {
    this.migrationsPath = path.join(__dirname, 'scripts');
  }

  async runMigrations() {
    try {
      console.log('Starting database migrations...');
      
      //get all migration files
      const migrationFiles = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.js'))
        .sort();

      if (migrationFiles.length === 0) {
        console.log('No migration files found.');
        return;
      }
      // get already executed migrations
      const executedMigrations = await Migration.find({ status: 'success' });
      const executedVersions = executedMigrations.map(m => m.version);
      // run pending migrations
      for (const file of migrationFiles) {
        const version = path.basename(file, '.js');
        if (executedVersions.includes(version)) {
          console.log(`Migration ${version} already executed, skipping...`);
          continue;
        }

        console.log(`Running migration: ${version}`);
        try {
          //create migration record
          const migrationRecord = new Migration({
            version,
            name: file,
            status: 'pending'
          });
          await migrationRecord.save();

          //import and execute migration
          const migrationModule = await import(`./scripts/${file}`);
          await migrationModule.up();

          //update their status to success
          migrationRecord.status = 'success';
          await migrationRecord.save();
          console.log(`Migration ${version} completed successfully`);
        } catch (error) {
          console.error(`Migration ${version} failed:`, error.message);
          
          // update their status to failed
          await Migration.updateOne(
            { version },
            { status: 'failed' }
          );
          
          throw error;
        }
      }
      console.log('All migrations completed successfully!');
    } catch (error) {
      console.error('Migration process failed:', error.message);
      throw error;
    }
  }
  async rollback(version) {
    try {
      console.log(`Rolling back migration: ${version}`);
      
      const migrationRecord = await Migration.findOne({ version });
      if (!migrationRecord) {
        throw new Error(`Migration ${version} not found`);
      }
      if (migrationRecord.status !== 'success') {
        throw new Error(`Migration ${version} was not successfully executed`);
      }
      // import and execute rollback
      const migrationModule = await import(`./scripts/${version}.js`);
      if (migrationModule.down) {
        await migrationModule.down();
        // remove migration record
        await Migration.deleteOne({ version });
        console.log(`Migration ${version} rolled back successfully`);
      } else {
        console.log(`No rollback function found for migration ${version}`);
      }
    } catch (error) {
      console.error(`Rollback failed:`, error.message);
      throw error;
    }
  }
  async getStatus() {
    const migrations = await Migration.find().sort({ version: 1 });
    return migrations;
  }
}

export default MigrationRunner;