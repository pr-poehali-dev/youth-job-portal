// Утилиты для синхронизации данных с БД

const JOBS_API = 'https://functions.poehali.dev/45d3fa5f-388c-486d-9dff-ff2e5e7d10b9';
const APPLICATIONS_API = 'https://functions.poehali.dev/8ff782a6-0660-4548-a99e-bdbbbf8661b5';

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
      const jobs = data.jobs || [];
      if (jobs.length > 0) {
        localStorage.setItem('jobs_cache', JSON.stringify(jobs));
      }
      return jobs;
    }
  } catch (error) {
    console.warn('API недоступен, использую кеш:', error);
    const cached = localStorage.getItem('jobs_cache');
    if (cached) {
      return JSON.parse(cached);
    }
  }
  return [];
}

export async function saveJobToDatabase(job: any): Promise<boolean> {
  try {
    const response = await fetch(JOBS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving job:', error);
    return false;
  }
}

export async function saveApplicationToDatabase(application: any): Promise<boolean> {
  try {
    const result = await fetch(APPLICATIONS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application)
    });
    if (result.ok) {
      const cached = localStorage.getItem('applications_cache');
      const apps = cached ? JSON.parse(cached) : [];
      apps.push(application);
      localStorage.setItem('applications_cache', JSON.stringify(apps));
      return true;
    }
  } catch (error) {
    console.warn('API недоступен, сохраняю в кеш:', error);
    const cached = localStorage.getItem('applications_cache');
    const apps = cached ? JSON.parse(cached) : [];
    apps.push(application);
    localStorage.setItem('applications_cache', JSON.stringify(apps));
    return true;
  }
  return false;
}

export async function loadApplicationsFromDatabase(userId?: string, jobId?: string): Promise<any[]> {
  try {
    let url = APPLICATIONS_API;
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (jobId) params.append('job_id', jobId);
    if (params.toString()) url += '?' + params.toString();
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const apps = data.applications || [];
      if (apps.length > 0) {
        localStorage.setItem('applications_cache', JSON.stringify(apps));
      }
      return apps;
    }
  } catch (error) {
    console.warn('API недоступен, использую кеш:', error);
    const cached = localStorage.getItem('applications_cache');
    if (cached) {
      const all = JSON.parse(cached);
      return all.filter((a: any) => {
        if (userId && a.user_id !== userId) return false;
        if (jobId && a.job_id !== jobId) return false;
        return true;
      });
    }
  }
  return [];
}

export async function loadJobByIdFromDatabase(jobId: number): Promise<any | null> {
  try {
    const response = await fetch(`${JOBS_API}?id=${jobId}`);
    if (response.ok) {
      const data = await response.json();
      const jobs = data.jobs || [];
      return jobs.find((j: any) => j.id === jobId) || null;
    }
  } catch (error) {
    console.warn('API недоступен, использую кеш:', error);
    const cached = localStorage.getItem('jobs_cache');
    if (cached) {
      const jobs = JSON.parse(cached);
      return jobs.find((j: any) => j.id === jobId) || null;
    }
  }
  return null;
}