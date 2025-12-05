import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      const storedActivities = localStorage.getItem(`activities_${user.id}`);
      const storedSaved = localStorage.getItem(`saved_${user.id}`);
      
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      } else {
        setActivities([]);
      }
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

  const addResponse = (jobId: number, jobTitle: string, company: string) => {
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
      getStats
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