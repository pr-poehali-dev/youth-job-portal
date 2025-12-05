import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface ResponseData {
  userId: string;
  userName: string;
  userEmail: string;
  jobId: number;
  jobTitle: string;
  timestamp: number;
}

const EmployerProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const usersList = users.filter((u: any) => u.role === 'user');
      setAllUsers(usersList);

      const allResponses: ResponseData[] = [];
      users.forEach((u: any) => {
        if (u.role === 'user') {
          const userActivities = JSON.parse(localStorage.getItem(`activities_${u.id}`) || '[]');
          const userResponses = userActivities.filter((a: any) => a.action === 'response');
          
          userResponses.forEach((r: any) => {
            allResponses.push({
              userId: u.id,
              userName: u.name,
              userEmail: u.email,
              jobId: r.jobId,
              jobTitle: r.jobTitle,
              timestamp: r.timestamp
            });
          });
        }
      });

      allResponses.sort((a, b) => b.timestamp - a.timestamp);
      setResponses(allResponses);
    };

    loadData();
    
    const interval = setInterval(loadData, 2000);
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
        <div className="max-w-6xl mx-auto">
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
                    <Badge variant="default" className="bg-primary">
                      <Icon name="Briefcase" size={14} className="mr-1" />
                      Работодатель
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Icon name="Send" size={32} className="mx-auto mb-2 text-blue-500" />
                <div className="text-3xl font-bold">{responses.length}</div>
                <div className="text-muted-foreground text-sm">Откликов получено</div>
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
                <Icon name="Briefcase" size={32} className="mx-auto mb-2 text-purple-500" />
                <div className="text-3xl font-bold">8</div>
                <div className="text-muted-foreground text-sm">Активных вакансий</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Send" size={20} />
                  Отклики на вакансии
                </CardTitle>
                <CardDescription>
                  Последние отклики от кандидатов
                </CardDescription>
              </CardHeader>
              <CardContent>
                {responses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Откликов пока нет</p>
                ) : (
                  <div className="space-y-4">
                    {responses.slice(0, 10).map((response, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <Icon name="User" size={20} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{response.userName}</span>
                            <Badge variant="outline" className="text-xs">{response.userEmail}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Откликнулся на: <span className="font-medium">{response.jobTitle}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{formatTime(response.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={20} />
                  База кандидатов
                </CardTitle>
                <CardDescription>
                  Все зарегистрированные пользователи
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Кандидатов пока нет</p>
                ) : (
                  <div className="space-y-4">
                    {allUsers.map((candidate) => (
                      <div key={candidate.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition">
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <Icon name="User" size={20} className="text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{candidate.name}</div>
                          <p className="text-sm text-muted-foreground mb-1">{candidate.email}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary">{candidate.age} лет</Badge>
                            {candidate.completedTest && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-700">
                                <Icon name="CheckCircle" size={12} className="mr-1" />
                                Тест пройден
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;