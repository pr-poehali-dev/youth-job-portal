import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useActivity } from '@/contexts/ActivityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const MyChats = () => {
  const { user } = useAuth();
  const { activities } = useActivity();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const responseActivities = activities
    .filter(a => a.action === 'response')
    .sort((a, b) => b.timestamp - a.timestamp);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    return `${diffDays} дн назад`;
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          <div className="flex gap-3">
            <Link to="/profile">
              <Button variant="outline">
                <Icon name="User" size={16} className="mr-2" />
                Профиль
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <h1 className="text-3xl font-bold">Мои переписки</h1>
          </div>

          {responseActivities.length > 0 ? (
            <div className="space-y-3">
              {responseActivities.map((activity) => (
                <Card 
                  key={activity.id}
                  className="hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/chat/${activity.jobId}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Icon name="Building2" size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{activity.company}</h3>
                        <p className="text-sm text-muted-foreground">{activity.jobTitle}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">
                          {formatTime(activity.timestamp)}
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="bg-secondary/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageSquare" size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Нет переписок</h3>
                <p className="text-muted-foreground mb-6">
                  Откликнитесь на вакансии, чтобы начать общение с работодателями
                </p>
                <Link to="/vacancies">
                  <Button>
                    <Icon name="Briefcase" size={16} className="mr-2" />
                    Смотреть вакансии
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyChats;
