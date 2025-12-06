import { defaultJobs } from '@/data/jobs';
import { saveJobToDatabase } from './syncData';

export async function restoreDefaultJobs() {
  console.log('Starting to restore default jobs to database...');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const job of defaultJobs) {
    try {
      const success = await saveJobToDatabase({
        ...job,
        employerId: 'default',
        employerEmail: 'mininkonstantin@gmail.com'
      });
      
      if (success) {
        successCount++;
        console.log(`✓ Restored job ${job.id}: ${job.title}`);
      } else {
        failCount++;
        console.error(`✗ Failed to restore job ${job.id}: ${job.title}`);
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      failCount++;
      console.error(`✗ Error restoring job ${job.id}:`, error);
    }
  }
  
  console.log(`\nRestore completed: ${successCount} success, ${failCount} failed`);
  return { successCount, failCount };
}

// Auto-run once if not already restored
if (typeof window !== 'undefined') {
  const restored = localStorage.getItem('default_jobs_restored');
  if (!restored) {
    restoreDefaultJobs().then(result => {
      if (result.successCount > 0) {
        localStorage.setItem('default_jobs_restored', 'true');
      }
    });
  }
}
