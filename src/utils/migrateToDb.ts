import { syncJobsToDatabase } from './syncData';

export async function migrateLocalJobsToDatabase() {
  const stored = localStorage.getItem('jobs');
  if (!stored) {
    console.log('No local jobs to migrate');
    return { success: true, count: 0 };
  }

  try {
    const jobs = JSON.parse(stored);
    console.log('Migrating', jobs.length, 'jobs to database...');
    
    await syncJobsToDatabase(jobs);
    
    console.log('Migration completed successfully!');
    return { success: true, count: jobs.length };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}

// Автоматическая миграция при первом запуске
if (typeof window !== 'undefined') {
  const migrated = localStorage.getItem('jobs_migrated');
  if (!migrated) {
    migrateLocalJobsToDatabase().then(result => {
      if (result.success) {
        localStorage.setItem('jobs_migrated', 'true');
        console.log(`✅ Migrated ${result.count} jobs to database`);
      }
    });
  }
}
