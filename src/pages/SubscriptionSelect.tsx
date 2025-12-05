import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const SubscriptionSelect = () => {
  const { user, updateSubscription } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'employer') {
    navigate('/');
    return null;
  }

  const handleSelectPlan = (plan: 'basic' | 'premium') => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    updateSubscription(plan, expiryDate.toISOString());
    navigate('/employer-profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Выберите подписку</h1>
          <p className="text-muted-foreground text-lg">
            Для размещения вакансий необходимо оформить подписку
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-lg border-2 border-border hover:border-primary transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Briefcase" size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Базовая</h2>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">2 500₽</span>
                <span className="text-muted-foreground">/месяц</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span>1 активная вакансия</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Доступ к базе кандидатов</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Просмотр профтестов</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Базовая поддержка</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan('basic')}
              className="w-full"
              variant="outline"
            >
              Выбрать базовую
            </Button>
          </div>

          <div className="bg-gradient-to-b from-primary/5 to-primary/10 p-8 rounded-lg border-2 border-primary relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
              Популярный
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Icon name="Crown" size={24} className="text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Премиум</h2>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">5 000₽</span>
                <span className="text-muted-foreground">/месяц</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="font-semibold">Неограниченное количество вакансий</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="font-semibold">Вакансии всегда наверху списка</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="font-semibold">Возможность создать премиум-вакансию</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Приоритетная поддержка</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Расширенная аналитика</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan('premium')}
              className="w-full"
            >
              Выбрать премиум
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Премиум-вакансии могут просматривать только работники с премиум-подпиской
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSelect;
