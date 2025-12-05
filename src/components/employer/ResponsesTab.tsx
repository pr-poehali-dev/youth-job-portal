import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export interface ResponseData {
  userId: string;
  userName: string;
  userEmail: string;
  userAge: number;
  jobId: number;
  jobTitle: string;
  timestamp: number;
  testScore?: number;
  testDate?: number;
}

interface ResponsesTabProps {
  responses: ResponseData[];
  responsesByJob: Record<number, ResponseData[]>;
  formatTime: (timestamp: number) => string;
}

const ResponsesTab = ({ responses, responsesByJob, formatTime }: ResponsesTabProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Отклики на вакансии</CardTitle>
        <CardDescription>
          Все отклики от кандидатов сгруппированы по вакансиям
        </CardDescription>
      </CardHeader>
      <CardContent>
        {responses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Пока нет откликов на ваши вакансии</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(responsesByJob).map(([jobId, jobResponses]) => (
              <div key={jobId} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{jobResponses[0].jobTitle}</h3>
                  <Badge>{jobResponses.length} {jobResponses.length === 1 ? 'отклик' : 'откликов'}</Badge>
                </div>
                <div className="space-y-3">
                  {jobResponses.map((response, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition">
                      <div className="bg-blue-500/10 p-3 rounded-full">
                        <Icon name="User" size={24} className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-lg">{response.userName}</span>
                          <Badge variant="outline">{response.userAge} лет</Badge>
                          {response.testScore && (
                            <Badge variant="default" className="bg-green-500">
                              <Icon name="CheckCircle2" size={12} className="mr-1" />
                              {response.testScore}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="Mail" size={14} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{response.userEmail}</span>
                        </div>
                        {response.testDate && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Calendar" size={12} />
                            <span>Тест пройден: {new Date(response.testDate).toLocaleDateString('ru-RU')}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTime(response.timestamp)}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/chat/${response.jobId}?userId=${response.userId}`)}
                      >
                        <Icon name="MessageSquare" size={16} className="mr-2" />
                        Чат
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsesTab;
