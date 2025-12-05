import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'employer';
  subscription?: 'basic' | 'premium' | null;
  companyName?: string;
  companyDescription?: string;
}

interface EmployerHeaderProps {
  user: User;
}

const EmployerHeader = ({ user }: EmployerHeaderProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(user.companyDescription || '');

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, companyDescription: description } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id === user.id) {
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, companyDescription: description }));
    }
    
    setIsEditing(false);
    window.location.reload();
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="bg-primary/10 p-6 rounded-full">
            <Icon name="Building2" size={64} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <Button 
                onClick={() => setIsEditing(!isEditing)} 
                variant="outline" 
                size="sm"
              >
                <Icon name={isEditing ? 'X' : 'Edit'} size={16} className="mr-2" />
                {isEditing ? 'Отмена' : 'Редактировать'}
              </Button>
            </div>
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
            
            {isEditing ? (
              <div className="mt-4 space-y-3">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Расскажите о вашей компании: чем занимаетесь, какие ценности, что предлагаете сотрудникам..."
                  rows={4}
                  className="resize-none"
                />
                <Button onClick={handleSave}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            ) : (
              user.companyDescription && (
                <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{user.companyDescription}</p>
                </div>
              )
            )}
            
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