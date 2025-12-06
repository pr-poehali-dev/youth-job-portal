import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveApplicationToDatabase, loadApplicationsFromDatabase, loadJobsFromDatabase } from '@/utils/syncData';

interface Activity {
  id: string;
  action: 'response' | 'save' | 'view';
  jobId: number;
  jobTitle: string;
  company: string;
  timestamp: number;
}

interface ActivityContextType {
  activities: Activity[];
  savedJobs: number[];
  addResponse: (jobId: number, jobTitle: string, company: string) => void;
  toggleSaveJob: (jobId: number, jobTitle: string, company: string) => void;
  addView: (jobId: number, jobTitle: string, company: string) => void;
  isJobSaved: (jobId: number) => boolean;
  hasResponded: (jobId: number) => boolean;
  getStats: () => { responses: number; saved: number; views: number };
  refreshApplications: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      loadApplicationsFromDatabase(user.id).then(async applications => {
        const jobs = await loadJobsFromDatabase();
        const jobsMap = new Map(jobs.map(j => [j.id.toString(), j]));
        
        const responseActivities = applications
          .filter(app => app.status === 'pending' || app.status === 'accepted' || app.status === 'rejected')
          .map(app => {
            const job = jobsMap.get(app.job_id);
            return {
              id: app.id,
              action: 'response' as const,
              jobId: parseInt(app.job_id),
              jobTitle: job?.title || 'Вакансия',
              company: job?.company || 'Компания',
              timestamp: new Date(app.created_at).getTime()
            };
          });
        
        setActivities(responseActivities);
      });
      
      const storedSaved = localStorage.getItem(`saved_${user.id}`);
      if (storedSaved) {
        setSavedJobs(JSON.parse(storedSaved));
      } else {
        setSavedJobs([]);
      }
    } else {
      setActivities([]);
      setSavedJobs([]);
    }
  }, [user]);

  const saveToStorage = (newActivities: Activity[], newSaved: number[]) => {
    if (user) {
      localStorage.setItem(`activities_${user.id}`, JSON.stringify(newActivities));
      localStorage.setItem(`saved_${user.id}`, JSON.stringify(newSaved));
    }
  };

  const addResponse = async (jobId: number, jobTitle: string, company: string) => {
    if (!user) return;
    
    const success = await saveApplicationToDatabase({
      job_id: jobId.toString(),
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone || '',
      user_age: user.age,
      cover_letter: '',
      status: 'pending'
    });
    
    if (success) {
      const newActivity: Activity = {
        id: Date.now().toString(),
        action: 'response',
        jobId,
        jobTitle,
        company,
        timestamp: Date.now()
      };
      
      const newActivities = [newActivity, ...activities];
      setActivities(newActivities);
      saveToStorage(newActivities, savedJobs);
    }
  };

  const toggleSaveJob = (jobId: number, jobTitle: string, company: string) => {
    let newSaved: number[];
    let newActivities = [...activities];

    if (savedJobs.includes(jobId)) {
      newSaved = savedJobs.filter(id => id !== jobId);
      newActivities = activities.filter(a => !(a.action === 'save' && a.jobId === jobId));
    } else {
      newSaved = [...savedJobs, jobId];
      const newActivity: Activity = {
        id: Date.now().toString(),
        action: 'save',
        jobId,
        jobTitle,
        company,
        timestamp: Date.now()
      };
      newActivities = [newActivity, ...activities];
    }

    setSavedJobs(newSaved);
    setActivities(newActivities);
    saveToStorage(newActivities, newSaved);
  };

  const addView = (jobId: number, jobTitle: string, company: string) => {
    const alreadyViewed = activities.some(a => a.action === 'view' && a.jobId === jobId);
    if (alreadyViewed) return;

    const newActivity: Activity = {
      id: Date.now().toString(),
      action: 'view',
      jobId,
      jobTitle,
      company,
      timestamp: Date.now()
    };
    
    const newActivities = [newActivity, ...activities];
    setActivities(newActivities);
    saveToStorage(newActivities, savedJobs);
  };

  const isJobSaved = (jobId: number) => savedJobs.includes(jobId);
  
  const hasResponded = (jobId: number) => {
    return activities.some(a => a.action === 'response' && a.jobId === jobId);
  };
  
  const refreshApplications = async () => {
    if (!user) return;
    const applications = await loadApplicationsFromDatabase(user.id);
    const jobs = await loadJobsFromDatabase();
    const jobsMap = new Map(jobs.map(j => [j.id.toString(), j]));
    
    const responseActivities = applications
      .filter(app => app.status === 'pending' || app.status === 'accepted' || app.status === 'rejected')
      .map(app => {
        const job = jobsMap.get(app.job_id);
        return {
          id: app.id,
          action: 'response' as const,
          jobId: parseInt(app.job_id),
          jobTitle: job?.title || 'Вакансия',
          company: job?.company || 'Компания',
          timestamp: new Date(app.created_at).getTime()
        };
      });
    setActivities(responseActivities);
  };

  const getStats = () => ({
    responses: activities.filter(a => a.action === 'response').length,
    saved: savedJobs.length,
    views: new Set(activities.filter(a => a.action === 'view').map(a => a.jobId)).size
  });

  return (
    <ActivityContext.Provider value={{ 
      activities, 
      savedJobs,
      addResponse, 
      toggleSaveJob, 
      addView,
      isJobSaved,
      hasResponded,
      getStats,
      refreshApplications
    }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};