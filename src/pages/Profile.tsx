import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Откликов', value: '3', icon: 'Send', color: 'text-blue-500' },
    { label: 'Сохранено', value: '7', icon: 'Heart', color: 'text-red-500' },
    { label: 'Просмотрено', value: '24', icon: 'Eye', color: 'text-green-500' },
  ];

  const recentActivity = [
    { action: 'Отклик на вакансию', job: 'Стажер программист', company: 'IT StartUp', time: '2 часа назад', icon: 'Send' },
    { action: 'Сохранена вакансия', job: 'SMM-помощник', company: 'Digital Agency', time: '5 часов назад', icon: 'Heart' },
    { action: 'Просмотрена вакансия', job: 'Курьер', company: 'Delivery Express', time: '1 день назад', icon: 'Eye' },
  ];

  const skills = user.testResult 
    ? ['Коммуникабельность', 'Ответственность', 'Обучаемость', 'Пунктуальность']
    : [];

  return (
    <div className="min-h-screen bg-secondary/10">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="bg-primary/10 p-6 rounded-full">
                      <Icon name="User" size={64} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                      <div className="space-y-2 text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Icon name="Mail" size={16} />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} />
                          <span>{user.age} лет</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} />
                          <span>Красноярск</span>
                        </div>
                      </div>
                      {user.completedTest && user.testResult && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Icon name="Star" size={14} className="mr-1" />
                          {user.testResult}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Icon name="Settings" size={16} className="mr-2" />
                      Редактировать
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <Icon name={stat.icon as any} size={32} className={stat.color} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Последняя активность</CardTitle>
                  <CardDescription>Ваши недавние действия на платформе</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon name={activity.icon as any} size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.job} • {activity.company}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {user.completedTest && user.testResult ? (
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={20} className="text-green-500" />
                      <CardTitle className="text-lg">Тест пройден</CardTitle>
                    </div>
                    <CardDescription>
                      Ваша рекомендуемая сфера
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-lg mb-4">{user.testResult}</p>
                    <Link to="/test">
                      <Button variant="outline" size="sm" className="w-full">
                        <Icon name="RefreshCw" size={16} className="mr-2" />
                        Пройти заново
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <CardTitle>Пройдите тест</CardTitle>
                    <CardDescription>
                      Узнайте, какая работа вам подходит
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/test">
                      <Button className="w-full">
                        <Icon name="ClipboardList" size={16} className="mr-2" />
                        Начать тест
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Навыки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/vacancies">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Briefcase" size={16} className="mr-2" />
                      Все вакансии
                    </Button>
                  </Link>
                  {user.testResult && (
                    <Link to="/vacancies">
                      <Button variant="outline" className="w-full justify-start">
                        <Icon name="Star" size={16} className="mr-2" />
                        Рекомендации для меня
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="MessageSquare" size={16} className="mr-2" />
                    Мои переписки
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Heart" size={16} className="mr-2" />
                    Сохранённые вакансии
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Icon name="Info" size={20} className="text-primary" />
                    <div>
                      <h3 className="font-semibold mb-1">Совет дня</h3>
                      <p className="text-sm text-muted-foreground">
                        Обновляйте свой профиль и регулярно проверяйте новые вакансии для лучших результатов!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
