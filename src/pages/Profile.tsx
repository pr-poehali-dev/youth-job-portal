import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
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

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-muted-foreground">{user.age} лет</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-full">
                <Icon name="User" size={48} className="text-primary" />
              </div>
            </div>

            {user.completedTest && user.testResult && (
              <div className="bg-secondary/50 p-4 rounded-lg border border-border mt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                  Профориентационный тест пройден
                </h3>
                <p className="text-muted-foreground">
                  Ваша рекомендуемая сфера: <span className="text-foreground font-semibold">{user.testResult}</span>
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              to="/test" 
              className="bg-card p-6 rounded-lg border border-border hover:border-primary transition group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition">
                  <Icon name="ClipboardList" size={32} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Профориентационный тест</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                {user.completedTest 
                  ? 'Пройти тест заново и обновить результаты' 
                  : 'Пройдите тест и узнайте, какая работа вам подходит'}
              </p>
              <div className="flex items-center gap-2 text-primary">
                <span>{user.completedTest ? 'Пройти заново' : 'Начать тест'}</span>
                <Icon name="ArrowRight" size={16} />
              </div>
            </Link>

            <Link 
              to="/vacancies" 
              className="bg-card p-6 rounded-lg border border-border hover:border-primary transition group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition">
                  <Icon name="Briefcase" size={32} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Вакансии</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Просмотрите доступные вакансии в Красноярске для подростков 14-17 лет
              </p>
              <div className="flex items-center gap-2 text-primary">
                <span>Смотреть вакансии</span>
                <Icon name="ArrowRight" size={16} />
              </div>
            </Link>
          </div>

          {user.completedTest && user.testResult && (
            <div className="mt-6">
              <Link 
                to="/vacancies" 
                className="block bg-primary text-primary-foreground p-6 rounded-lg hover:bg-primary/90 transition text-center"
              >
                <h3 className="text-xl font-semibold mb-2">
                  Рекомендованные вакансии для вас
                </h3>
                <p className="text-sm opacity-90">
                  На основе ваших результатов теста: {user.testResult}
                </p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
