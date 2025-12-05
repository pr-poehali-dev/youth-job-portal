import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const UserSubscription = () => {
  const { user, updateSubscription } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'user') {
    navigate('/');
    return null;
  }

  const handleSelectPremium = () => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    updateSubscription('premium', expiryDate.toISOString());
    navigate('/vacancies');
  };

  const handleSkip = () => {
    navigate('/vacancies');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Icon name="Crown" size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Премиум подписка</h1>
          <p className="text-muted-foreground text-lg">
            Получите доступ к эксклюзивным вакансиям
          </p>
        </div>

        <div className="bg-gradient-to-b from-primary/5 to-primary/10 p-8 rounded-lg border-2 border-primary">
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">150₽</span>
              <span className="text-muted-foreground">/месяц</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold block">Доступ к премиум-вакансиям</span>
                <span className="text-sm text-muted-foreground">
                  Откликайтесь на эксклюзивные предложения от лучших работодателей
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold block">Приоритет в откликах</span>
                <span className="text-sm text-muted-foreground">
                  Ваше резюме увидят первым
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold block">Расширенная статистика</span>
                <span className="text-sm text-muted-foreground">
                  Узнайте, кто просмотрел ваше резюме
                </span>
              </div>
            </li>
          </ul>

          <div className="space-y-3">
            <Button
              onClick={handleSelectPremium}
              className="w-full"
              size="lg"
            >
              <Icon name="Crown" size={20} className="mr-2" />
              Оформить премиум за 150₽
            </Button>
            
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full"
            >
              Продолжить без подписки
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Вы всегда сможете оформить подписку позже в профиле
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSubscription;
