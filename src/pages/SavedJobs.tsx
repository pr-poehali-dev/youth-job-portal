import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useActivity } from '@/contexts/ActivityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { allJobs } from '@/data/jobs';

const SavedJobs = () => {
  const { user } = useAuth();
  const { savedJobs, toggleSaveJob } = useActivity();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const savedJobsList = allJobs.filter(job => savedJobs.includes(job.id));

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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <h1 className="text-3xl font-bold">Сохранённые вакансии</h1>
            <Badge variant="secondary" className="ml-auto">
              {savedJobsList.length} {savedJobsList.length === 1 ? 'вакансия' : savedJobsList.length < 5 ? 'вакансии' : 'вакансий'}
            </Badge>
          </div>

          {savedJobsList.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {savedJobsList.map((job) => (
                <Card 
                  key={job.id}
                  className="hover:shadow-md transition cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Link to={`/job/${job.id}`} className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Icon name="Building2" size={16} />
                          <span>{job.company}</span>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id, job.title, job.company);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Icon name="Heart" size={20} fill="currentColor" />
                      </Button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="MapPin" size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Clock" size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Users" size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{job.ageRange} лет</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-2xl font-bold text-primary">{job.salary}</span>
                      <Link to={`/job/${job.id}`}>
                        <Button size="sm">
                          Подробнее
                          <Icon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="bg-secondary/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Heart" size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Нет сохранённых вакансий</h3>
                <p className="text-muted-foreground mb-6">
                  Сохраняйте понравившиеся вакансии, чтобы не потерять их
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

export default SavedJobs;
