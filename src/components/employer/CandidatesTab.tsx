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
  userSubscription?: 'basic' | 'premium' | null;
}

const CandidatesTab = ({ allUsers, userSubscription }: CandidatesTabProps) => {
  const isPremium = userSubscription === 'premium';
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="FileText" size={16} className="mr-2" />
                    Профиль
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Профиль кандидата</DialogTitle>
                    <DialogDescription>
                      {candidate.name}, {candidate.age} лет
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Контакты:</p>
                      <p className="font-medium">{candidate.email}</p>
                    </div>
                    
                    {candidate.completedTest && candidate.testResult ? (
                      isPremium ? (
                        <>
                          <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Icon name="Target" size={20} className="text-primary" />
                              <h3 className="font-semibold text-lg">Результаты профориентационного теста</h3>
                            </div>
                            
                            <div className="space-y-4">
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
                              
                              {candidate.testAnswers && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Ответы на вопросы теста:</p>
                                  <div className="bg-secondary/30 p-4 rounded-lg space-y-3 max-h-64 overflow-y-auto">
                                    {candidate.testAnswers.map((answer: any, idx: number) => (
                                      <div key={idx} className="text-sm">
                                        <p className="font-medium mb-1">{idx + 1}. {answer.question}</p>
                                        <p className="text-muted-foreground pl-4">→ {answer.answer}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="border-t pt-4">
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                            <Icon name="Crown" size={32} className="text-yellow-500 mx-auto mb-2" />
                            <p className="font-semibold mb-2">Результаты профтеста доступны только с премиум подпиской</p>
                            <p className="text-sm text-muted-foreground mb-3">
                              Обновите подписку, чтобы видеть результаты профориентационных тестов кандидатов
                            </p>
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Check" size={12} className="mr-1" />
                              Тест пройден
                            </Badge>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="border-t pt-4">
                        <div className="bg-secondary/30 rounded-lg p-4 text-center">
                          <Icon name="AlertCircle" size={32} className="text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Кандидат ещё не прошёл профориентационный тест
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidatesTab;