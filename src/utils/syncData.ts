// Утилиты для синхронизации данных с БД

const JOBS_API = 'https://functions.poehali.dev/45d3fa5f-388c-486d-9dff-ff2e5e7d10b9';
const RESPONSES_API = 'https://functions.poehali.dev/6876307b-09ba-41ba-a4c4-bbf1b5e97e4a';

export async function syncJobsToDatabase(jobs: any[]) {
  for (const job of jobs) {
    try {
      await fetch(JOBS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
    } catch (error) {
      console.error('Error syncing job:', job.id, error);
    }
  }
}

export async function loadJobsFromDatabase(): Promise<any[]> {
  try {
    const response = await fetch(JOBS_API);
    if (response.ok) {
      const data = await response.json();
      return data.jobs || [];
    }
  } catch (error) {
    console.error('Error loading jobs from DB:', error);
  }
  return [];
}

export async function saveJobToDatabase(job: any): Promise<boolean> {
  try {
    console.log('Sending job to API:', job.title);
    const response = await fetch(JOBS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to save job ${job.title}:`, response.status, errorText);
      return false;
    }
    
    console.log(`Successfully saved job: ${job.title}`);
    return true;
  } catch (error) {
    console.error(`Fetch error for ${job.title}:`, error);
    return false;
  }
}

export async function updateJobInDatabase(job: any): Promise<boolean> {
  try {
    const response = await fetch(JOBS_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating job:', error);
    return false;
  }
}

export async function deleteJobFromDatabase(jobId: string | number): Promise<boolean> {
  try {
    const response = await fetch(JOBS_API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jobId })
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting job:', error);
    return false;
  }
}

export async function saveResponseToDatabase(response: any): Promise<boolean> {
  try {
    const result = await fetch(RESPONSES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    });
    return result.ok;
  } catch (error) {
    console.error('Error saving response:', error);
    return false;
  }
}

export async function loadResponsesFromDatabase(): Promise<any[]> {
  try {
    const response = await fetch(RESPONSES_API);
    if (response.ok) {
      const data = await response.json();
      return data.responses || [];
    }
  } catch (error) {
    console.error('Error loading responses from DB:', error);
  }
  return [];
}