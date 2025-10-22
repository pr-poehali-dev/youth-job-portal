import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Question {
  id: number;
  question: string;
  options: { text: string; category: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Что вам больше нравится делать в свободное время?',
    options: [
      { text: 'Общаться с людьми и помогать им', category: 'Работа с людьми' },
      { text: 'Работать с компьютером или гаджетами', category: 'IT и технологии' },
      { text: 'Создавать что-то своими руками', category: 'Творчество и дизайн' },
      { text: 'Заниматься спортом и активным отдыхом', category: 'Активная работа' },
    ],
  },
  {
    id: 2,
    question: 'Какие предметы в школе вам даются легче всего?',
    options: [
      { text: 'Литература, история, обществознание', category: 'Работа с людьми' },
      { text: 'Математика, информатика, физика', category: 'IT и технологии' },
      { text: 'ИЗО, технология, музыка', category: 'Творчество и дизайн' },
      { text: 'Физкультура, ОБЖ', category: 'Активная работа' },
    ],
  },
  {
    id: 3,
    question: 'Какая рабочая атмосфера вам ближе?',
    options: [
      { text: 'Работа в команде с постоянным общением', category: 'Работа с людьми' },
      { text: 'Работа за компьютером в тихом месте', category: 'IT и технологии' },
      { text: 'Творческая студия с возможностью экспериментировать', category: 'Творчество и дизайн' },
      { text: 'Активная работа с передвижениями', category: 'Активная работа' },
    ],
  },
  {
    id: 4,
    question: 'Что для вас важнее в работе?',
    options: [
      { text: 'Помогать людям и видеть их благодарность', category: 'Работа с людьми' },
      { text: 'Решать логические задачи', category: 'IT и технологии' },
      { text: 'Создавать красивые вещи', category: 'Творчество и дизайн' },
      { text: 'Быть в движении и не сидеть на месте', category: 'Активная работа' },
    ],
  },
  {
    id: 5,
    question: 'Как вы предпочитаете проводить выходные?',
    options: [
      { text: 'Встречаться с друзьями, посещать мероприятия', category: 'Работа с людьми' },
      { text: 'Изучать новые программы или играть в игры', category: 'IT и технологии' },
      { text: 'Рисовать, фотографировать, монтировать видео', category: 'Творчество и дизайн' },
      { text: 'Заниматься спортом, гулять, путешествовать', category: 'Активная работа' },
    ],
  },
];

const Test = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const { user, updateTestResult } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAnswer = (category: string) => {
    const newAnswers = [...answers, category];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = calculateResult(newAnswers);
      updateTestResult(result);
      setShowResult(true);
    }
  };

  const calculateResult = (userAnswers: string[]): string => {
    const counts: { [key: string]: number } = {};
    
    userAnswers.forEach((answer) => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    let maxCategory = '';
    let maxCount = 0;

    Object.entries(counts).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxCategory = category;
      }
    });

    return maxCategory;
  };

  const getRecommendations = (result: string): string[] => {
    const recommendations: { [key: string]: string[] } = {
      'Работа с людьми': [
        'Помощник на ресепшн',
        'Помощник в кофейне',
        'Помощник аниматора',
        'Оператор call-центра',
      ],
      'IT и технологии': [
        'Стажер программист',
        'Тестировщик игр',
        'SMM-помощник',
        'Контент-модератор',
      ],
      'Творчество и дизайн': [
        'Стажер-дизайнер',
        'Помощник фотографа',
        'Стажер видеомонтажер',
        'Оператор соцсетей',
      ],
      'Активная работа': [
        'Курьер',
        'Промоутер',
        'Раздатчик флаеров',
        'Помощник тренера',
      ],
    };

    return recommendations[result] || [];
  };

  if (showResult) {
    const result = user.testResult || '';
    const recommendations = getRecommendations(result);

    return (
      <div className="min-h-screen">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card p-8 rounded-lg border border-border text-center">
              <div className="bg-green-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Icon name="CheckCircle" size={48} className="text-green-500" />
              </div>

              <h1 className="text-3xl font-bold mb-4">Тест завершен!</h1>
              
              <div className="bg-secondary/50 p-6 rounded-lg mb-6">
                <p className="text-muted-foreground mb-2">Ваша рекомендуемая сфера:</p>
                <p className="text-2xl font-bold text-primary">{result}</p>
              </div>

              <div className="text-left mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Briefcase" size={20} />
                  Подходящие вакансии для вас:
                </h3>
                <ul className="space-y-2">
                  {recommendations.map((job, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="CheckCircle2" size={16} className="text-primary" />
                      {job}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Link to="/vacancies">
                  <Button>
                    Смотреть вакансии
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline">
                    В личный кабинет
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Вопрос {currentQuestion + 1} из {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-6">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.category)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition">
                      <Icon name="Circle" size={20} className="text-primary" />
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/profile" className="text-muted-foreground hover:text-foreground transition text-sm">
              Отменить тест
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
