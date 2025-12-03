import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Question {
  id: number;
  text: string;
  scale: number;
}

const questions: Question[] = [
  // ШКАЛА 1: Профессиональные склонности (10 вопросов)
  { id: 1, text: 'Мне нравится придумывать что-то новое, выражать свои мысли через рисунок, музыку или текст.', scale: 1 },
  { id: 2, text: 'Меня увлекает наблюдение за растениями, животными и явлениями природы.', scale: 1 },
  { id: 3, text: 'Мне нравится находить, анализировать и проверять факты, узнавать новости и события.', scale: 1 },
  { id: 4, text: 'Я люблю разбираться, как устроены различные механизмы, чинить или собирать что-то своими руками.', scale: 1 },
  { id: 5, text: 'Мне нравится помогать другим людям, объяснять им что-то или как-то иначе консультировать.', scale: 1 },
  { id: 6, text: 'Я чувствую себя дизайнером, художником, писателем или музыкантом.', scale: 1 },
  { id: 7, text: 'Мне интересны вопросы экологии, биологии, сельского хозяйства или ветеринарии.', scale: 1 },
  { id: 8, text: 'Мне легко даются доклады, исследования, написание статей или ведение блога.', scale: 1 },
  { id: 9, text: 'Я с удовольствием провожу время за компьютером, разбираясь в программировании, устройство или программирую.', scale: 1 },
  { id: 10, text: 'Я чувствую себя комфортно, работая в команде, организуя совместные проекты или управляя людьми.', scale: 1 },

  // ШКАЛА 2: Профессиональные способности (10 вопросов)
  { id: 11, text: 'Я умею находить творческий подход для решения любой задачи.', scale: 2 },
  { id: 12, text: 'Я способен разбираться в животных или растениях.', scale: 2 },
  { id: 13, text: 'Я могу легко преобразовывать информацию.', scale: 2 },
  { id: 14, text: 'Я обладаю навыками создавать новые механизмы.', scale: 2 },
  { id: 15, text: 'Я умею легко понимать и чувствовать других людей.', scale: 2 },
  { id: 16, text: 'Я способен легко говорить и выступать перед другими людьми.', scale: 2 },
  { id: 17, text: 'Я умею заботиться о здоровье и благополучии окружающей среды.', scale: 2 },
  { id: 18, text: 'Я обладаю навыками сосредоточенно и усидчиво выполнять свою работу.', scale: 2 },
  { id: 19, text: 'Я умею пользоваться приборами, машинами и механизмами в работе.', scale: 2 },
  { id: 20, text: 'Я способен легко налаживать контакт с незнакомыми людьми.', scale: 2 },

  // ШКАЛА 3: Эмоциональная устойчивость (10 вопросов)
  { id: 21, text: 'Я сохраняю спокойствие даже в стрессовых ситуациях.', scale: 3 },
  { id: 22, text: 'Мне легко прийти в себя после неудачи или разочарования.', scale: 3 },
  { id: 23, text: 'Я редко испытываю сильное раздражение или гнев.', scale: 3 },
  { id: 24, text: 'Я спокойно воспринимаю критику и стараюсь извлечь из неё пользу.', scale: 3 },
  { id: 25, text: 'Под давлением я становлюсь более собранным и эффективным.', scale: 3 },
  { id: 26, text: 'Мелкие проблемы не способны вывести меня из равновесия.', scale: 3 },
  { id: 27, text: 'Я обычно оптимистично смотрю на будущее, даже когда что-то идет не так.', scale: 3 },
  { id: 28, text: 'Я могу контролировать свои эмоции и не поддаваться импульсивным решениям.', scale: 3 },
  { id: 29, text: 'Мне трудно сосредоточиться, когда я тревожусь.', scale: 3 },
  { id: 30, text: 'Я чувствую себя уверенно, даже если задача кажется сложной или незнакомой.', scale: 3 },

  // ШКАЛА 4: Условия работы (10 вопросов)
  { id: 31, text: 'Я предпочитаю работать в команде, а не в одиночку.', scale: 4 },
  { id: 32, text: 'Я готов к работе, которая требует частые перемещения.', scale: 4 },
  { id: 33, text: 'Я предпочитаю работу с чётким графиком и конкретными задачами.', scale: 4 },
  { id: 34, text: 'Мне важно, чтобы была возможность проявлять свою инициативу на работе.', scale: 4 },
  { id: 35, text: 'Мне нравится, когда работа включает в себя много общения и взаимодействия с людьми.', scale: 4 },
  { id: 36, text: 'Я бы хотел(-а) работать в динамичной среде, где постоянно что-то меняется.', scale: 4 },
  { id: 37, text: 'Я готов к работе, которая требует большой ответственности и принятия важных решений.', scale: 4 },
  { id: 38, text: 'Я предпочитаю работу, которая требует физической активности или практических навыков.', scale: 4 },
  { id: 39, text: 'Мне интересна работа, где нужно анализировать много данных и работать с информацией.', scale: 4 },
  { id: 40, text: 'Мне нравится работать в офисе или помещении, нежели чем на открытом пространстве.', scale: 4 },

  // ШКАЛА 5: Мотивация (10 вопросов)
  { id: 41, text: 'Мои профессиональные планы в основном основаны на моих личных интересах.', scale: 5 },
  { id: 42, text: 'На мой выбор профессии сильно влияют советы родителей или других взрослых.', scale: 5 },
  { id: 43, text: 'Я всегда смогу достичь успеха в выбранной мной сфере деятельности.', scale: 5 },
  { id: 44, text: 'Мне важно, чтобы мой выбор одобрили друзья или окружающие.', scale: 5 },
  { id: 45, text: 'Я чувствую внутреннюю уверенность в своём будущем профессиональном пути.', scale: 5 },
  { id: 46, text: 'Я ищу профессию, которая позволит мне быть счастливым(-ой) и свободным(-ой) в своих действиях.', scale: 5 },
  { id: 47, text: 'Я готов(-а) брать на себя ответственность за свои решения в будущей профессии.', scale: 5 },
  { id: 48, text: 'Я сомневаюсь в правильности своего выбора и мнения.', scale: 5 },
  { id: 49, text: 'Мне важно, чтобы моя профессия вызывала социальное одобрение.', scale: 5 },
  { id: 50, text: 'Мне важно, чтобы моя профессия приносила хороший заработок.', scale: 5 },
];

const Test = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(50).fill(0));
  const [showResult, setShowResult] = useState(false);
  const { user, updateTestResult } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = calculateResult(newAnswers);
      updateTestResult(result);
      setShowResult(true);
    }
  };

  const calculateResult = (userAnswers: number[]): string => {
    // Подсчет баллов по каждой шкале
    const scale1 = userAnswers.slice(0, 10).reduce((a, b) => a + b, 0);
    const scale2 = userAnswers.slice(10, 20).reduce((a, b) => a + b, 0);
    const scale3 = userAnswers.slice(20, 30).reduce((a, b) => a + b, 0);
    const scale4 = userAnswers.slice(30, 40).reduce((a, b) => a + b, 0);
    const scale5 = userAnswers.slice(40, 50).reduce((a, b) => a + b, 0);

    // Определение ведущей профессиональной склонности (шкала 1)
    // Каждая категория - это сумма двух соответствующих вопросов
    const categories = [
      { name: 'Творчество и искусство', score: userAnswers[0] + userAnswers[5] },
      { name: 'Природа и экология', score: userAnswers[1] + userAnswers[6] },
      { name: 'Работа с информацией', score: userAnswers[2] + userAnswers[7] },
      { name: 'Техника и механизмы', score: userAnswers[3] + userAnswers[8] },
      { name: 'Работа с людьми', score: userAnswers[4] + userAnswers[9] },
    ];

    // Находим максимальный балл
    const maxScore = Math.max(...categories.map(c => c.score));
    
    // Находим все категории с максимальным баллом
    const maxCategories = categories.filter(c => c.score === maxScore);
    
    // Если несколько категорий с одинаковым баллом, выбираем случайную
    const maxCategory = maxCategories[Math.floor(Math.random() * maxCategories.length)];

    // Интерпретация эмоциональной устойчивости
    let emotionalDescription = '';
    if (scale3 >= 40) {
      emotionalDescription = 'Вы хорошо справляетесь со стрессом, умеете контролировать эмоции и быстро восстанавливаетесь после трудностей. Это ценное качество для любой профессии, особенно для тех, где высока ответственность и динамичность.';
    } else if (scale3 >= 30) {
      emotionalDescription = 'Вы обычно справляетесь со стрессом, но можете испытывать трудности в очень сложных или длительных стрессовых ситуациях. Есть потенциал для развития навыков саморегуляции.';
    } else {
      emotionalDescription = 'Вы можете быть более чувствительны к стрессу, часто испытывать тревогу, раздражение или трудности с восстановлением. Важно уделять внимание развитию стратегий совладания со стрессом.';
    }

    return `${maxCategory.name}|||${emotionalDescription}`;
  };

  const getEmotionalDescription = (result: string): string => {
    const parts = result.split('|||');
    return parts[1] || '';
  };

  const getRecommendations = (result: string): string[] => {
    const recommendations: { [key: string]: string[] } = {
      'Творчество и искусство': [
        'Стажер-дизайнер',
        'Помощник фотографа',
        'SMM-помощник',
        'Оператор соцсетей',
      ],
      'Природа и экология': [
        'Помощник в зоопарке',
        'Помощник флориста',
        'Волонтер в эко-проектах',
        'Помощник в питомнике',
      ],
      'Работа с информацией': [
        'Контент-модератор',
        'Помощник в библиотеке',
        'Стажер-журналист',
        'Оператор ввода данных',
      ],
      'Техника и механизмы': [
        'Стажер программист',
        'Тестировщик игр',
        'Помощник в IT-компании',
        'Помощник механика',
      ],
      'Работа с людьми': [
        'Помощник на ресепшн',
        'Помощник аниматора',
        'Оператор call-центра',
        'Промоутер',
      ],
    };

    // Извлекаем основную категорию из результата
    const parts = result.split('|||');
    const mainCategory = Object.keys(recommendations).find(key => parts[0].includes(key));
    return mainCategory ? recommendations[mainCategory] : [];
  };

  if (showResult) {
    const result = user.testResult || '';
    const parts = result.split('|||');
    const mainResult = parts[0] || result;
    const emotionalText = getEmotionalDescription(result);
    const recommendations = getRecommendations(result);

    return (
      <div className="min-h-screen bg-secondary/10">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card p-8 rounded-lg border border-border text-center shadow-lg">
              <div className="bg-green-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Icon name="CheckCircle" size={48} className="text-green-500" />
              </div>

              <h1 className="text-3xl font-bold mb-4">Тест завершен!</h1>
              
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg mb-6 border border-primary/20">
                <p className="text-muted-foreground mb-2">Ваш профессиональный профиль:</p>
                <p className="text-2xl font-bold text-primary mb-4">{mainResult}</p>
              </div>

              {emotionalText && (
                <div className="text-left mb-6 bg-blue-500/5 p-6 rounded-lg border border-blue-500/20">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                    <Icon name="Heart" size={22} className="text-blue-500" />
                    Эмоциональная устойчивость:
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{emotionalText}</p>
                </div>
              )}

              <div className="text-left mb-6 bg-secondary/30 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                  <Icon name="Briefcase" size={22} className="text-primary" />
                  Рекомендованные вакансии:
                </h3>
                <ul className="space-y-3">
                  {recommendations.map((job, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="CheckCircle2" size={18} className="text-primary flex-shrink-0" />
                      <span>{job}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/vacancies">
                  <Button size="lg" className="gap-2">
                    Смотреть вакансии
                    <Icon name="ArrowRight" size={18} />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" size="lg">
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
  const currentScale = questions[currentQuestion].scale;
  const scaleNames = ['', 'Склонности', 'Способности', 'Устойчивость', 'Условия работы', 'Мотивация'];

  return (
    <div className="min-h-screen bg-secondary/10">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-sm font-medium text-primary">
                  ШКАЛА {currentScale}: {scaleNames[currentScale]}
                </span>
                <span className="text-sm text-muted-foreground ml-3">
                  Вопрос {currentQuestion + 1} из {questions.length}
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
            <div className="mb-8">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                Оцените утверждение
              </p>
              <h2 className="text-xl font-semibold leading-relaxed">
                {questions[currentQuestion].text}
              </h2>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Выберите вариант, который наиболее точно отражает ваше мнение:
              </p>
              
              {[
                { score: 1, label: 'Совершенно не согласен/не характерно для меня', color: 'hover:border-red-500/50' },
                { score: 2, label: 'Скорее не согласен/редко характерно для меня', color: 'hover:border-orange-500/50' },
                { score: 3, label: 'Затрудняюсь ответить/частично согласен', color: 'hover:border-yellow-500/50' },
                { score: 4, label: 'Скорее согласен/часто характерно для меня', color: 'hover:border-blue-500/50' },
                { score: 5, label: 'Полностью согласен/очень характерно для меня', color: 'hover:border-green-500/50' },
              ].map((option) => (
                <button
                  key={option.score}
                  onClick={() => handleAnswer(option.score)}
                  className={`w-full text-left p-4 rounded-lg border-2 border-border bg-card
                    hover:bg-secondary/50 hover:shadow-md transition-all duration-200
                    ${option.color} hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">{option.score}</span>
                    </div>
                    <span className="text-sm leading-relaxed">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="mt-6 gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                Предыдущий вопрос
              </Button>
            )}
          </div>

          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              💡 Пожалуйста, внимательно прочитайте каждое утверждение и выберите вариант ответа, 
              который наиболее точно отражает ваше мнение или поведение. Здесь нет "правильных" 
              или "неправильных" ответов. Будьте максимально честны с собой.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;