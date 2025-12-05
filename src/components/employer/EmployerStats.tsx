import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface EmployerStatsProps {
  responsesCount: number;
  interviewsCount: number;
  candidatesCount: number;
  vacanciesCount: number;
  userEmail: string;
}

const EmployerStats = ({ responsesCount, interviewsCount, candidatesCount, vacanciesCount, userEmail }: EmployerStatsProps) => {
  const showCandidates = userEmail === 'mininkonstantin@gmail.com';
  
  return (
    <div className={`grid ${showCandidates ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 mb-6`}>
      <Card>
        <CardContent className="p-6 text-center">
          <Icon name="Send" size={32} className="mx-auto mb-2 text-blue-500" />
          <div className="text-3xl font-bold">{responsesCount}</div>
          <div className="text-muted-foreground text-sm">Откликов получено</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Icon name="Calendar" size={32} className="mx-auto mb-2 text-purple-500" />
          <div className="text-3xl font-bold">{interviewsCount}</div>
          <div className="text-muted-foreground text-sm">Собеседований</div>
        </CardContent>
      </Card>
      {showCandidates && (
        <Card>
          <CardContent className="p-6 text-center">
            <Icon name="Users" size={32} className="mx-auto mb-2 text-green-500" />
            <div className="text-3xl font-bold">{candidatesCount}</div>
            <div className="text-muted-foreground text-sm">Кандидатов в базе</div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-6 text-center">
          <Icon name="Briefcase" size={32} className="mx-auto mb-2 text-orange-500" />
          <div className="text-3xl font-bold">{vacanciesCount}</div>
          <div className="text-muted-foreground text-sm">Активных вакансий</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerStats;