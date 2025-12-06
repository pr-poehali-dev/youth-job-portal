import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { Job, defaultJobs } from '@/data/jobs';
import EmployerHeader from '@/components/employer/EmployerHeader';
import EmployerStats from '@/components/employer/EmployerStats';
import ResponsesTab, { ResponseData } from '@/components/employer/ResponsesTab';
import InterviewsTab, { InterviewData } from '@/components/employer/InterviewsTab';
import VacanciesTab from '@/components/employer/VacanciesTab';
import CandidatesTab from '@/components/employer/CandidatesTab';
import { loadJobsFromDatabase, loadApplicationsFromDatabase } from '@/utils/syncData';


const EmployerProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const dbJobs = await loadJobsFromDatabase();
      const stored = localStorage.getItem('jobs');
      const localJobs: Job[] = stored ? JSON.parse(stored) : defaultJobs;
      const loadedJobs = dbJobs.length > 0 ? dbJobs : localJobs;
      setAllJobs(loadedJobs);
      if (dbJobs.length > 0) {
        localStorage.setItem('jobs', JSON.stringify(dbJobs));
      }

      try {
        const response = await fetch('https://functions.poehali.dev/81ba1a01-47ea-40ac-9ce8-1dc2aa32d523?resource=users');
        if (response.ok) {
          const data = await response.json();
          const usersList = (data.users || []).filter((u: any) => u.role !== 'employer');
          console.log('✅ Загружено кандидатов из БД:', usersList.length);
          setAllUsers(usersList);
        } else {
          console.error('❌ Ошибка загрузки пользователей:', response.status);
          setAllUsers([]);
        }
      } catch (error) {
        console.error('❌ Критическая ошибка при загрузке:', error);
        setAllUsers([]);
      }

      const employerJobs = user.email === 'mininkonstantin@gmail.com'
        ? loadedJobs
        : loadedJobs.filter(job => job.employerId === user.id);
      const employerJobIds = employerJobs.map(job => String(job.id));

      const dbResponses = await loadApplicationsFromDatabase();
      const relevantResponses = dbResponses
        .filter((r: any) => {
          const jobIdFromResponse = r.jobId || r.job_id;
          return employerJobIds.includes(String(jobIdFromResponse));
        })
        .map((r: any) => {
          const jobIdFromResponse = r.jobId || r.job_id;
          const job = loadedJobs.find(j => String(j.id) === String(jobIdFromResponse));
          return {
            userId: r.userId || r.user_id,
            userName: r.userName || r.user_name,
            userEmail: r.userEmail || r.user_email,
            userAge: r.userAge || r.user_age,
            jobId: jobIdFromResponse,
            jobTitle: job?.title || 'Вакансия',
            timestamp: r.createdAt ? new Date(r.createdAt).getTime() : (r.created_at ? new Date(r.created_at).getTime() : Date.now())
          };
        });
      console.log('📋 Отклики после фильтрации:', relevantResponses.length);
      setResponses(relevantResponses);

      try {
        console.log('📋 Загрузка собеседований для вакансий:', employerJobIds);
        const interviewsResponse = await fetch('https://functions.poehali.dev/81ba1a01-47ea-40ac-9ce8-1dc2aa32d523?resource=interviews');
        if (interviewsResponse.ok) {
          const data = await interviewsResponse.json();
          const allDbInterviews = data.interviews || [];
          console.log('📊 Всего собеседований в БД:', allDbInterviews.length);
          console.log('🔍 Пример первого собеседования:', allDbInterviews[0]);
          
          const employerInterviews = allDbInterviews.filter((interview: any) => 
            employerJobIds.includes(String(interview.jobId))
          );
          employerInterviews.sort((a: any, b: any) => b.timestamp - a.timestamp);
          setInterviews(employerInterviews);
          console.log('✅ Загружено собеседований работодателя:', employerInterviews.length);
        } else {
          console.error('❌ Ошибка ответа при загрузке собеседований:', interviewsResponse.status);
          setInterviews([]);
        }
      } catch (error) {
        console.error('❌ Критическая ошибка загрузки собеседований:', error);
        setInterviews([]);
      }
    };

    loadData();
    
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/profile');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'employer') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClearCache = () => {
    if (confirm('Очистить весь кэш браузера? Вам нужно будет войти заново.')) {
      localStorage.clear();
      alert('✅ Кэш очищен! Сейчас перенаправлю на страницу входа.');
      window.location.href = '/login';
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'минуту' : 'минут'} назад`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} назад`;
    return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} назад`;
  };

  const responsesByJob = responses.reduce((acc, response) => {
    if (!acc[response.jobId]) {
      acc[response.jobId] = [];
    }
    acc[response.jobId].push(response);
    return acc;
  }, {} as Record<number | string, ResponseData[]>);

  const employerJobs = user.email === 'mininkonstantin@gmail.com'
    ? allJobs
    : allJobs.filter(job => job.employerId === user.id);

  return (
    <div className="min-h-screen bg-secondary/10">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          <div className="flex gap-2">
            <Button onClick={handleClearCache} variant="ghost" size="sm" title="Очистить кэш">
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Очистить кэш
            </Button>
            <Button onClick={() => navigate('/login')} variant="outline" size="sm">
              <Icon name="UserPlus" size={16} className="mr-2" />
              Сменить аккаунт
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <EmployerHeader user={user} />

          <EmployerStats 
            responsesCount={responses.length}
            interviewsCount={interviews.length}
            candidatesCount={allUsers.length}
            vacanciesCount={employerJobs.length}
            userEmail={user.email}
          />

          <Tabs defaultValue="responses" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="responses">
                <Icon name="Send" size={16} className="mr-2" />
                Отклики
              </TabsTrigger>
              <TabsTrigger value="interviews">
                <Icon name="Calendar" size={16} className="mr-2" />
                Собеседования
              </TabsTrigger>
              <TabsTrigger value="vacancies">
                <Icon name="Briefcase" size={16} className="mr-2" />
                Вакансии
              </TabsTrigger>
              {user?.email === 'mininkonstantin@gmail.com' && (
                <TabsTrigger value="candidates">
                  <Icon name="Users" size={16} className="mr-2" />
                  База кандидатов
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="responses" className="mt-6">
              <ResponsesTab 
                responses={responses}
                responsesByJob={responsesByJob}
                formatTime={formatTime}
              />
            </TabsContent>

            <TabsContent value="interviews" className="mt-6">
              <InterviewsTab interviews={interviews} />
            </TabsContent>

            <TabsContent value="vacancies" className="mt-6">
              <VacanciesTab 
                allJobs={employerJobs}
                responsesByJob={responsesByJob}
              />
            </TabsContent>

            {user?.email === 'mininkonstantin@gmail.com' && (
              <TabsContent value="candidates" className="mt-6">
                <CandidatesTab allUsers={allUsers} userSubscription={user.subscription} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;