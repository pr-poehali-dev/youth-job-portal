import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'employer';
  subscription?: 'basic' | 'premium' | null;
  companyName?: string;
}

interface EmployerHeaderProps {
  user: User;
}

const EmployerHeader = ({ user }: EmployerHeaderProps) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default EmployerHeader;
