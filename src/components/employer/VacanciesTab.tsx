import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Job } from '@/data/jobs';
import { ResponseData } from './ResponsesTab';
import { deleteJobFromDatabase } from '@/utils/syncData';
import { useState } from 'react';

interface VacanciesTabProps {
  allJobs: Job[];
  responsesByJob: Record<number, ResponseData[]>;
}

const VacanciesTab = ({ allJobs, responsesByJob }: VacanciesTabProps) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const handleDelete = async (jobId: string | number) => {
    if (!confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      return;
    }

    setDeletingId(jobId);
    const success = await deleteJobFromDatabase(jobId);
    
    if (success) {
      const stored = localStorage.getItem('jobs');
      if (stored) {
        const jobs = JSON.parse(stored);
        const filtered = jobs.filter((j: any) => j.id.toString() !== jobId.toString());
        localStorage.setItem('jobs', JSON.stringify(filtered));
      }
      window.location.reload();
    } else {
      alert('Не удалось удалить вакансию');
    }
    
    setDeletingId(null);
  };

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
        {allJobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Briefcase" size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-4">У вас пока нет активных вакансий</p>
            <Button onClick={() => navigate('/create-job')}>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать первую вакансию
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {allJobs.map((job) => {
            const jobResponses = responsesByJob[job.id] || [];
            return (
              <div key={job.id} className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Building2" size={14} />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={jobResponses.length > 0 ? "default" : "secondary"}>
                      {jobResponses.length} {jobResponses.length === 1 ? 'отклик' : 'откликов'}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/edit-job/${job.id}`)}
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      Изменить
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                    >
                      {deletingId === job.id ? (
                        <Icon name="Loader2" size={14} className="animate-spin" />
                      ) : (
                        <Icon name="Trash2" size={14} />
                      )}
                    </Button>
                  </div>
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
        )}
      </CardContent>
    </Card>
  );
};

export default VacanciesTab;