import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CandidatesTabProps {
  allUsers: any[];
}

const CandidatesTab = ({ allUsers }: CandidatesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>База кандидатов</CardTitle>
        <CardDescription>
          Все зарегистрированные подростки на платформе
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allUsers.map((candidate) => (
            <div key={candidate.id} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Icon name="User" size={24} className="text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-lg">{candidate.name}</span>
                  <Badge variant="outline">{candidate.age} лет</Badge>
                  {candidate.testResult && (
                    <Badge variant="default" className="bg-primary">
                      {candidate.testResult}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Mail" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{candidate.email}</span>
                </div>
                {candidate.completedTest && candidate.testScore && (
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Target" size={14} className="text-green-500" />
                    <span className="text-green-500 font-medium">Профтест: {candidate.testScore}%</span>
                  </div>
                )}
              </div>
              {candidate.completedTest && candidate.testResult && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon name="FileText" size={16} className="mr-2" />
                      Подробнее
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Результаты профтеста</DialogTitle>
                      <DialogDescription>
                        {candidate.name}, {candidate.age} лет
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Рекомендованная категория:</p>
                        <Badge variant="default" className="text-base py-1 px-3">
                          {candidate.testResult}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Процент совпадения:</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${candidate.testScore || 0}%` }}
                            />
                          </div>
                          <span className="font-semibold">{candidate.testScore || 0}%</span>
                        </div>
                      </div>
                      {candidate.testDate && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Дата прохождения:</p>
                          <p className="font-medium">{new Date(candidate.testDate).toLocaleDateString('ru-RU')}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Контакты:</p>
                        <p className="font-medium">{candidate.email}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidatesTab;
