import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { jobsDetails } from '@/data/jobs';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const job = id ? jobsDetails[Number(id)] : undefined;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Вакансия не найдена</h2>
          <Link to="/vacancies">
            <Button>Вернуться к вакансиям</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isRecommended = user?.testResult && job.category === user.testResult;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          <div className="flex gap-3">
            {user ? (
              <Link to="/profile">
                <Button variant="outline">
                  <Icon name="User" size={16} className="mr-2" />
                  Личный кабинет
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button>Регистрация</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-6"
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Назад к вакансиям</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  {isRecommended && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Icon name="Star" size={14} className="mr-1" />
                      Рекомендовано
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xl text-muted-foreground mb-4">
                  <Icon name="Building2" size={20} />
                  <span>{job.company}</span>
                </div>
                <div className="text-3xl font-bold text-primary mb-6">{job.salary}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon name="MapPin" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Локация</div>
                  <div className="font-semibold">{job.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon name="Clock" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Тип занятости</div>
                  <div className="font-semibold">{job.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Возраст</div>
                  <div className="font-semibold">{job.ageRange} лет</div>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-6">{job.description}</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Icon name="ListChecks" size={24} className="text-primary" />
                  Требования
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Icon name="CheckCircle2" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Briefcase" size={24} className="text-primary" />
                  Обязанности
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Icon name="Circle" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  Условия работы
                </h3>
                <ul className="space-y-2">
                  {job.conditions.map((cond, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Icon name="CheckCircle2" size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Phone" size={24} className="text-primary" />
                  Контактная информация
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={18} className="text-muted-foreground" />
                    <a href={`tel:${job.contact.phone}`} className="text-primary hover:underline">
                      {job.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={18} className="text-muted-foreground" />
                    <a href={`mailto:${job.contact.email}`} className="text-primary hover:underline">
                      {job.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={() => navigate(`/chat/${job.id}`)}
              >
                <Icon name="Send" size={18} className="mr-2" />
                Откликнуться на вакансию
              </Button>
              <Button size="lg" variant="outline">
                <Icon name="Heart" size={18} className="mr-2" />
                Сохранить
              </Button>
            </div>
          </div>

          {isRecommended && (
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Icon name="Lightbulb" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Это подходит вам!</h3>
                  <p className="text-muted-foreground">
                    На основе вашего профориентационного теста эта вакансия идеально 
                    соответствует вашей рекомендуемой сфере: <span className="font-semibold text-foreground">{job.category}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;