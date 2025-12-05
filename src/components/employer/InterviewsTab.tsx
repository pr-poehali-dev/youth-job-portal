import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export interface InterviewData {
  userId: string;
  userName: string;
  userEmail: string;
  jobId: number;
  jobTitle: string;
  date: string;
  time: string;
  timestamp: number;
}

interface InterviewsTabProps {
  interviews: InterviewData[];
}

const InterviewsTab = ({ interviews }: InterviewsTabProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Назначенные собеседования</CardTitle>
        <CardDescription>
          Все запланированные встречи с кандидатами
        </CardDescription>
      </CardHeader>
      <CardContent>
        {interviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Нет назначенных собеседований</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <Icon name="Calendar" size={24} className="text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-lg">{interview.userName}</span>
                    <Badge variant="default" className="bg-purple-500">
                      {new Date(interview.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Mail" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{interview.userEmail}</span>
                  </div>
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Вакансия:</span>{' '}
                    <span className="font-medium">{interview.jobTitle}</span>
                  </p>
                  <div className="flex items-center gap-3 text-sm mt-2">
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} className="text-muted-foreground" />
                      <span>{new Date(interview.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                      <span className="font-medium">{interview.time}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/chat/${interview.jobId}?userId=${interview.userId}`)}
                >
                  <Icon name="MessageSquare" size={16} className="mr-2" />
                  Чат
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewsTab;
