import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Job } from '@/data/jobs';
import { ResponseData } from './ResponsesTab';

interface VacanciesTabProps {
  allJobs: Job[];
  responsesByJob: Record<number, ResponseData[]>;
}

const VacanciesTab = ({ allJobs, responsesByJob }: VacanciesTabProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Мои вакансии</CardTitle>
            <CardDescription>
              Все активные вакансии с откликами
            </CardDescription>
          </div>
          <Button onClick={() => navigate('/create-job')}>
            <Icon name="Plus" size={16} className="mr-2" />
            Создать вакансию
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allJobs.map((job) => {
            const jobResponses = responsesByJob[job.id] || [];
            return (
              <div key={job.id} className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Building2" size={14} />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <Badge variant={jobResponses.length > 0 ? "default" : "secondary"}>
                    {jobResponses.length} {jobResponses.length === 1 ? 'отклик' : 'откликов'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Wallet" size={14} className="text-muted-foreground" />
                    <span className="font-medium">{job.salary}</span>
                  </div>
                </div>
                {jobResponses.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Последние отклики:</p>
                    <div className="flex flex-wrap gap-2">
                      {jobResponses.slice(0, 3).map((response, i) => (
                        <Badge key={i} variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => navigate(`/chat/${job.id}?userId=${response.userId}`)}>
                          <Icon name="User" size={12} className="mr-1" />
                          {response.userName}
                        </Badge>
                      ))}
                      {jobResponses.length > 3 && (
                        <Badge variant="secondary">+{jobResponses.length - 3} ещё</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default VacanciesTab;
