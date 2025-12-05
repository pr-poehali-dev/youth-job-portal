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
                          <div className="border-t pt-6">
                            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-primary/20">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="bg-primary/20 p-3 rounded-full">
                                  <Icon name="Target" size={24} className="text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-xl">Профориентационный тест</h3>
                                  <p className="text-sm text-muted-foreground">Детальные результаты тестирования</p>
                                </div>
                              </div>
                              
                              <div className="space-y-6">
                                <div className="bg-card rounded-lg p-5 border border-border shadow-sm">
                                  <div className="flex items-start gap-3 mb-3">
                                    <Icon name="Award" size={20} className="text-primary mt-1" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-muted-foreground mb-2">Рекомендованное направление</p>
                                      <Badge variant="default" className="text-base py-2 px-4 bg-gradient-to-r from-primary to-primary/80 rounded-sm">
                                        {candidate.testResult}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-card rounded-lg p-5 border border-border shadow-sm">
                                  <div className="flex items-start gap-3">
                                    <Icon name="TrendingUp" size={20} className="text-green-500 mt-1" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-muted-foreground mb-3">Уровень соответствия профилю</p>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                          <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                                            <div 
                                              className="bg-gradient-to-r from-green-500 to-primary h-3 rounded-full transition-all duration-500 shadow-sm"
                                              style={{ width: `${candidate.testScore || 0}%` }}
                                            />
                                          </div>
                                          <span className="font-bold text-xl min-w-[60px] text-right">{candidate.testScore || 0}%</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          {candidate.testScore >= 80 ? '🌟 Отличное соответствие' : 
                                           candidate.testScore >= 60 ? '✓ Хорошее соответствие' : 
                                           candidate.testScore >= 40 ? '○ Среднее соответствие' : 
                                           '△ Низкое соответствие'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {candidate.testDate && (
                                  <div className="bg-card rounded-lg p-5 border border-border shadow-sm">
                                    <div className="flex items-center gap-3">
                                      <Icon name="Calendar" size={20} className="text-blue-500" />
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Дата прохождения теста</p>
                                        <p className="font-semibold text-lg">{new Date(candidate.testDate).toLocaleDateString('ru-RU', { 
                                          day: 'numeric', 
                                          month: 'long', 
                                          year: 'numeric' 
                                        })}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {candidate.testAnswers && candidate.testAnswers.length > 0 && (
                                  <div className="bg-card rounded-lg p-5 border border-border shadow-sm">
                                    <div className="flex items-start gap-3 mb-4">
                                      <Icon name="MessageSquare" size={20} className="text-purple-500 mt-1" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Ответы кандидата</p>
                                        <p className="text-xs text-muted-foreground">Детальный анализ ответов на вопросы теста</p>
                                      </div>
                                    </div>
                                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                      {candidate.testAnswers.map((answer: any, idx: number) => (
                                        <div key={idx} className="bg-secondary/30 p-4 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors">
                                          <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                                              {idx + 1}
                                            </span>
                                            <div className="flex-1 space-y-2">
                                              <p className="font-medium text-sm leading-relaxed">{answer.question}</p>
                                              <div className="flex items-start gap-2 bg-card/50 p-2 rounded">
                                                <Icon name="ArrowRight" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-muted-foreground">{answer.answer}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
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