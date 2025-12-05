import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { allJobs } from '@/data/jobs';

interface ResponseData {
  userId: string;
  userName: string;
  userEmail: string;
  userAge: number;
  jobId: number;
  jobTitle: string;
  timestamp: number;
  testScore?: number;
  testDate?: number;
}

interface InterviewData {
  userId: string;
  userName: string;
  userEmail: string;
  jobId: number;
  jobTitle: string;
  date: string;
  time: string;
  timestamp: number;
}

const EmployerProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<InterviewData[]>([]);

  useEffect(() => {
    const loadData = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const usersList = users.filter((u: any) => u.role !== 'employer');
      setAllUsers(usersList);

      const allResponses: ResponseData[] = [];
      users.forEach((u: any) => {
        if (u.role !== 'employer') {
          const userActivities = JSON.parse(localStorage.getItem(`activities_${u.id}`) || '[]');
          const userResponses = userActivities.filter((a: any) => a.action === 'response');
          
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
      allInterviews.sort((a: InterviewData, b: InterviewData) => b.timestamp - a.timestamp);
      setInterviews(allInterviews);
    };

    loadData();
    
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

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
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="bg-primary/10 p-6 rounded-full">
                  <Icon name="Building2" size={64} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="Mail" size={16} />
                      <span>{user.email}</span>
                    </div>
                    {user.companyName && (
                      <div className="flex items-center gap-2">
                        <Icon name="Building2" size={16} />
                        <span>{user.companyName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-primary">
                        <Icon name="Briefcase" size={14} className="mr-1" />
                        Работодатель
                      </Badge>
                      {user.subscription && (
                        <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'} className={user.subscription === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}>
                          <Icon name={user.subscription === 'premium' ? 'Crown' : 'Check'} size={14} className="mr-1" />
                          {user.subscription === 'premium' ? 'Премиум' : 'Базовая'}
                        </Badge>
                      )}
                      {!user.subscription && (
                        <Badge variant="destructive">
                          <Icon name="AlertCircle" size={14} className="mr-1" />
                          Нет подписки
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!user.subscription && (
                    <Button onClick={() => navigate('/subscription-select')} className="mt-4">
                      <Icon name="CreditCard" size={16} className="mr-2" />
                      Оформить подписку
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Icon name="Send" size={32} className="mx-auto mb-2 text-blue-500" />
                <div className="text-3xl font-bold">{responses.length}</div>
                <div className="text-muted-foreground text-sm">Откликов получено</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Icon name="Calendar" size={32} className="mx-auto mb-2 text-purple-500" />
                <div className="text-3xl font-bold">{interviews.length}</div>
                <div className="text-muted-foreground text-sm">Собеседований</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Icon name="Users" size={32} className="mx-auto mb-2 text-green-500" />
                <div className="text-3xl font-bold">{allUsers.length}</div>
                <div className="text-muted-foreground text-sm">Кандидатов в базе</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Icon name="Briefcase" size={32} className="mx-auto mb-2 text-orange-500" />
                <div className="text-3xl font-bold">{allJobs.length}</div>
                <div className="text-muted-foreground text-sm">Активных вакансий</div>
              </CardContent>
            </Card>
          </div>

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
              <TabsTrigger value="candidates">
                <Icon name="Users" size={16} className="mr-2" />
                База кандидатов
              </TabsTrigger>
            </TabsList>

            <TabsContent value="responses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Отклики на вакансии</CardTitle>
                  <CardDescription>
                    Все отклики от кандидатов по вакансиям
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {responses.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Откликов пока нет</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Когда кандидаты откликнутся на ваши вакансии, они появятся здесь
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {responses.map((response, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
                          <div className="bg-blue-500/10 p-3 rounded-full">
                            <Icon name="User" size={24} className="text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-lg">{response.userName}</span>
                              <Badge variant="secondary">{response.userAge} лет</Badge>
                              {response.testScore !== undefined && (
                                <Badge variant={response.testScore >= 80 ? "default" : response.testScore >= 60 ? "secondary" : "outline"}>
                                  Тест: {response.testScore}%
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Mail" size={14} className="text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{response.userEmail}</span>
                            </div>
                            <p className="text-sm mb-1">
                              <span className="text-muted-foreground">Вакансия:</span>{' '}
                              <span className="font-medium">{response.jobTitle}</span>
                            </p>
                            {response.testDate && (
                              <p className="text-xs text-muted-foreground mb-1">
                                Тест пройден: {new Date(response.testDate).toLocaleDateString('ru-RU')}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">{formatTime(response.timestamp)}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/chat/${response.jobId}?userId=${response.userId}`)}
                          >
                            <Icon name="MessageSquare" size={16} className="mr-2" />
                            Чат
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Запланированные собеседования</CardTitle>
                  <CardDescription>
                    Все назначенные встречи с кандидатами
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {interviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Собеседований пока не назначено</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Назначайте собеседования через чат с кандидатами
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {interviews.map((interview, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
                          <div className="bg-purple-500/10 p-3 rounded-full">
                            <Icon name="Calendar" size={24} className="text-purple-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-lg">{interview.userName}</span>
                              <Badge variant="default" className="bg-purple-500">
                                {new Date(interview.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Mail" size={14} className="text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{interview.userEmail}</span>
                            </div>
                            <p className="text-sm mb-1">
                              <span className="text-muted-foreground">Вакансия:</span>{' '}
                              <span className="font-medium">{interview.jobTitle}</span>
                            </p>
                            <div className="flex items-center gap-3 text-sm mt-2">
                              <div className="flex items-center gap-1">
                                <Icon name="Calendar" size={14} className="text-muted-foreground" />
                                <span>{new Date(interview.date).toLocaleDateString('ru-RU')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon name="Clock" size={14} className="text-muted-foreground" />
                                <span className="font-medium">{interview.time}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/chat/${interview.jobId}?userId=${interview.userId}`)}
                          >
                            <Icon name="MessageSquare" size={16} className="mr-2" />
                            Чат
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vacancies" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Мои вакансии</CardTitle>
                      <CardDescription>
                        Все активные вакансии с откликами
                      </CardDescription>
                    </div>
                    <Button onClick={() => navigate('/create-job')}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Создать вакансию
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allJobs.map((job) => {
                      const jobResponses = responsesByJob[job.id] || [];
                      return (
                        <div key={job.id} className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon name="Building2" size={14} />
                                <span>{job.company}</span>
                              </div>
                            </div>
                            <Badge variant={jobResponses.length > 0 ? "default" : "secondary"}>
                              {jobResponses.length} {jobResponses.length === 1 ? 'отклик' : 'откликов'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Icon name="MapPin" size={14} className="text-muted-foreground" />
                              <span className="text-muted-foreground">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="Wallet" size={14} className="text-muted-foreground" />
                              <span className="font-medium">{job.salary}</span>
                            </div>
                          </div>
                          {jobResponses.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-sm text-muted-foreground mb-2">Последние отклики:</p>
                              <div className="flex flex-wrap gap-2">
                                {jobResponses.slice(0, 3).map((resp, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {resp.userName}
                                  </Badge>
                                ))}
                                {jobResponses.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{jobResponses.length - 3} ещё
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/job/${job.id}`)}
                            >
                              <Icon name="Eye" size={14} className="mr-1" />
                              Просмотр
                            </Button>
                            {jobResponses.length > 0 && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => navigate(`/chat/${job.id}`)}
                              >
                                <Icon name="MessageSquare" size={14} className="mr-1" />
                                Чаты ({jobResponses.length})
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="candidates" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>База кандидатов</CardTitle>
                  <CardDescription>
                    Все зарегистрированные пользователи
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Кандидатов пока нет</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {allUsers.map((candidate) => {
                        const candidateResponses = responses.filter(r => r.userId === candidate.id);
                        const candidateInterviews = interviews.filter(i => i.userId === candidate.id);
                        const testResult = localStorage.getItem(`test_result_${candidate.id}`);
                        const testData = testResult ? JSON.parse(testResult) : null;
                        
                        return (
                          <div key={candidate.id} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
                            <div className="bg-green-500/10 p-3 rounded-full">
                              <Icon name="User" size={24} className="text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-lg mb-1">{candidate.name}</div>
                              <p className="text-sm text-muted-foreground mb-2">{candidate.email}</p>
                              <div className="flex items-center gap-2 text-xs mb-2 flex-wrap">
                                <Badge variant="secondary">{candidate.age} лет</Badge>
                                {candidate.completedTest && (
                                  <Badge variant="outline" className="bg-green-500/10 text-green-700">
                                    <Icon name="CheckCircle" size={12} className="mr-1" />
                                    Тест пройден
                                  </Badge>
                                )}
                              </div>
                              {testData && (
                                <div className="mt-2 p-2 bg-secondary/50 rounded text-xs space-y-1">
                                  <p className="font-medium">Результаты теста:</p>
                                  <p><span className="text-muted-foreground">Правильных ответов:</span> <span className="font-medium">{testData.correctAnswers}/20</span></p>
                                  <p><span className="text-muted-foreground">Процент:</span> <span className="font-medium">{Math.round((testData.correctAnswers / 20) * 100)}%</span></p>
                                  <p className="text-muted-foreground">{new Date(testData.timestamp).toLocaleDateString('ru-RU')}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                {candidateResponses.length > 0 && (
                                  <span>Откликов: {candidateResponses.length}</span>
                                )}
                                {candidateInterviews.length > 0 && (
                                  <span>Собеседований: {candidateInterviews.length}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;