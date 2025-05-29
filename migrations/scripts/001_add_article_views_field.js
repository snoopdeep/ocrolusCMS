import mongoose from 'mongoose';

export async function up() {
  console.log('Adding views field to articles collection...');
  
  const db = mongoose.connection.db;
  
  //add views field to all existing articles
  const result = await db.collection('articles').updateMany(
    { views: { $exists: false } },
    { $set: { views: 0 } }
  );
  
  console.log(`Updated ${result.modifiedCount} articles with views field`);
  console.log('Views field added successfully');
}
export async function down() {
  console.log('Removing views field from articles collection...');
  
  const db = mongoose.connection.db;
  
  // remove views field from all articles
  const result = await db.collection('articles').updateMany(
    {},
    { $unset: { views: "" } }
  );
  
  console.log(`Removed views field from ${result.modifiedCount} articles`);
  console.log('Views field removed successfully');
}