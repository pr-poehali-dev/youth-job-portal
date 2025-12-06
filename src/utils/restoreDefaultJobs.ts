import { defaultJobs, jobsDetails } from '@/data/jobs';
import { saveJobToDatabase } from './syncData';

export async function restoreDefaultJobs() {
  console.log('Starting to restore default jobs to database...');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const job of defaultJobs) {
    try {
      const jobId = typeof job.id === 'number' ? job.id : parseInt(job.id as string);
      const detailedJob = jobsDetails[jobId];
      
      const enrichedJob = detailedJob ? {
        ...job,
        description: detailedJob.description,
        requirements: detailedJob.requirements,
        responsibilities: detailedJob.responsibilities,
        conditions: detailedJob.conditions,
        contact: detailedJob.contact,
        employerId: 'default',
        employerEmail: 'mininkonstantin@gmail.com'
      } : {
        ...job,
        description: `Работа в компании ${job.company}`,
        requirements: [`Возраст ${job.ageRange} лет`, 'Ответственность', 'Пунктуальность'],
        responsibilities: ['Выполнение рабочих задач', 'Соблюдение стандартов'],
        conditions: [`График: ${job.type}`, 'Официальное оформление'],
        contact: {
          phone: '+7 (391) 234-56-78',
          email: 'hr@company.ru'
        },
        employerId: 'default',
        employerEmail: 'mininkonstantin@gmail.com'
      };
      
      const success = await saveJobToDatabase(enrichedJob);
      
      if (success) {
        successCount++;
        console.log(`✓ Restored job ${job.id}: ${job.title}`);
      } else {
        failCount++;
        console.error(`✗ Failed to restore job ${job.id}: ${job.title}`);
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (error) {
      failCount++;
      console.error(`✗ Error restoring job ${job.id}:`, error);
    }
  }
  
  console.log(`\nRestore completed: ${successCount} success, ${failCount} failed`);
  return { successCount, failCount };
}

// Manually trigger restore if needed via console:
// import { restoreDefaultJobs } from '@/utils/restoreDefaultJobs'; 
// restoreDefaultJobs();