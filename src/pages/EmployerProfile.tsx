import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { allJobs } from '@/data/jobs';
import EmployerHeader from '@/components/employer/EmployerHeader';
import EmployerStats from '@/components/employer/EmployerStats';
import ResponsesTab, { ResponseData } from '@/components/employer/ResponsesTab';
import InterviewsTab, { InterviewData } from '@/components/employer/InterviewsTab';
import VacanciesTab from '@/components/employer/VacanciesTab';
import CandidatesTab from '@/components/employer/CandidatesTab';

const EmployerProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<InterviewData[]>([]);

  useEffect(() => {
    const loadData = () => {
      if (!user) return;

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const usersList = user.email === 'mininkonstantin@gmail.com' 
        ? users.filter((u: any) => u.role !== 'employer')
        : [];
      setAllUsers(usersList);

      const employerJobs = user.email === 'mininkonstantin@gmail.com'
        ? allJobs
        : allJobs.filter(job => job.employerId === user.id);
      const employerJobIds = employerJobs.map(job => job.id);

      const allResponses: ResponseData[] = [];
      users.forEach((u: any) => {
        if (u.role !== 'employer') {
          const userActivities = JSON.parse(localStorage.getItem(`activities_${u.id}`) || '[]');
          const userResponses = userActivities.filter((a: any) => 
            a.action === 'response' && employerJobIds.includes(a.jobId)
          );
          
          userResponses.forEach((r: any) => {
            allResponses.push({
              userId: u.id,
              userName: u.name,
              userEmail: u.email,
              userAge: u.age,
              jobId: r.jobId,
              jobTitle: r.jobTitle,
              timestamp: r.timestamp,
              testScore: u.testScore,
              testDate: u.testDate
            });
          });
        }
      });

      allResponses.sort((a, b) => b.timestamp - a.timestamp);
      setResponses(allResponses);

      const allInterviews = JSON.parse(localStorage.getItem('all_interviews') || '[]');
      const employerInterviews = allInterviews.filter((interview: InterviewData) => 
        employerJobIds.includes(interview.jobId)
      );
      employerInterviews.sort((a: InterviewData, b: InterviewData) => b.timestamp - a.timestamp);
      setInterviews(employerInterviews);
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
  }, {} as Record<number, ResponseData[]>);

  const employerJobs = user.email === 'mininkonstantin@gmail.com'
    ? allJobs
    : allJobs.filter(job => job.employerId === user.id);

  return (
    <div className="min-h-screen bg-secondary/10">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          <div className="flex gap-2">
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
          />

          <Tabs defaultValue="responses" className="w-full">
            <TabsList className={`grid w-full ${user.email === 'mininkonstantin@gmail.com' ? 'grid-cols-4' : 'grid-cols-3'}`}>
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
              {user.email === 'mininkonstantin@gmail.com' && (
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

            {user.email === 'mininkonstantin@gmail.com' && (
              <TabsContent value="candidates" className="mt-6">
                <CandidatesTab allUsers={allUsers} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;