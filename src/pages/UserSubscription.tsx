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

  const handleSelectPremiumPlus = () => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    updateSubscription('premium_plus', expiryDate.toISOString());
    navigate('/vacancies');
  };

  const handleSkip = () => {
    navigate('/vacancies');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Icon name="Crown" size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Премиум подписки</h1>
          <p className="text-muted-foreground text-lg">
            Выберите подходящий тариф для максимальных возможностей
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-b from-primary/5 to-primary/10 p-8 rounded-lg border-2 border-primary">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Премиум</h2>
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
                    Откликайтесь на эксклюзивные предложения
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

            <Button
              onClick={handleSelectPremium}
              className="w-full"
              size="lg"
            >
              <Icon name="Crown" size={20} className="mr-2" />
              Оформить за 150₽
            </Button>
          </div>

          <div className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 p-8 rounded-lg border-2 border-yellow-500 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Популярный
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Премиум Плюс</h2>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">249₽</span>
                <span className="text-muted-foreground">/месяц</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold block">Всё из тарифа Премиум</span>
                  <span className="text-sm text-muted-foreground">
                    Премиум-вакансии и приоритет
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Video" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold block">Обучающие видео</span>
                  <span className="text-sm text-muted-foreground">
                    Видеокурсы по освоению специальностей
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="GraduationCap" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold block">Практические задания</span>
                  <span className="text-sm text-muted-foreground">
                    Развивайте навыки для выбранной профессии
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="BookOpen" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold block">База знаний</span>
                  <span className="text-sm text-muted-foreground">
                    Полезные материалы по каждой специальности
                  </span>
                </div>
              </li>
            </ul>

            <Button
              onClick={handleSelectPremiumPlus}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              size="lg"
            >
              <Icon name="Sparkles" size={20} className="mr-2" />
              Оформить за 249₽
            </Button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full max-w-md"
          >
            Продолжить без подписки
          </Button>
          
          <p className="text-sm text-muted-foreground">
            💡 Вы всегда сможете оформить подписку позже в профиле
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSubscription;
