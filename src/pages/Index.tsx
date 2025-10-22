import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface User {
  name: string;
  email: string;
  age: number;
  testCompleted: boolean;
  recommendedJobs: string[];
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  ageRange: string;
  salary: string;
}

const mockJobs: Job[] = [
  { id: 1, title: 'Помощник в кофейне', company: 'Coffee House', location: 'Москва', type: 'Частичная', ageRange: '14-17', salary: '15000 ₽' },
  { id: 2, title: 'Курьер', company: 'Delivery Express', location: 'Санкт-Петербург', type: 'Гибкий график', ageRange: '16-17', salary: '20000 ₽' },
  { id: 3, title: 'Промоутер', company: 'Marketing Pro', location: 'Москва', type: 'Проектная', ageRange: '14-17', salary: '18000 ₽' },
  { id: 4, title: 'Помощник библиотекаря', company: 'Городская библиотека', location: 'Казань', type: 'Частичная', ageRange: '14-16', salary: '12000 ₽' },
  { id: 5, title: 'Стажер-дизайнер', company: 'Creative Studio', location: 'Удаленно', type: 'Стажировка', ageRange: '15-17', salary: '15000 ₽' },
  { id: 6, title: 'Помощник на ресепшн', company: 'Sport Complex', location: 'Екатеринбург', type: 'Частичная', ageRange: '16-17', salary: '17000 ₽' },
];

const careerTest = [
  {
    question: 'Что тебе больше нравится?',
    options: [
      { text: 'Работать с людьми', category: 'social' },
      { text: 'Работать с техникой', category: 'technical' },
      { text: 'Работать творчески', category: 'creative' },
      { text: 'Работать с документами', category: 'administrative' }
    ]
  },
  {
    question: 'Какое занятие тебе ближе?',
    options: [
      { text: 'Помогать другим', category: 'social' },
      { text: 'Решать логические задачи', category: 'technical' },
      { text: 'Создавать что-то новое', category: 'creative' },
      { text: 'Организовывать процессы', category: 'administrative' }
    ]
  },
  {
    question: 'Твоя сильная сторона?',
    options: [
      { text: 'Коммуникабельность', category: 'social' },
      { text: 'Внимательность к деталям', category: 'technical' },
      { text: 'Креативность', category: 'creative' },
      { text: 'Ответственность', category: 'administrative' }
    ]
  },
  {
    question: 'Где ты видишь себя через год?',
    options: [
      { text: 'Работаю с клиентами', category: 'social' },
      { text: 'Изучаю новые технологии', category: 'technical' },
      { text: 'Развиваю творческие навыки', category: 'creative' },
      { text: 'Управляю проектами', category: 'administrative' }
    ]
  },
  {
    question: 'Что для тебя важнее?',
    options: [
      { text: 'Общение и команда', category: 'social' },
      { text: 'Точность и качество', category: 'technical' },
      { text: 'Свобода самовыражения', category: 'creative' },
      { text: 'Порядок и стабильность', category: 'administrative' }
    ]
  }
];

const careerRecommendations = {
  social: ['Помощник в кофейне', 'Промоутер', 'Помощник на ресепшн'],
  technical: ['Курьер', 'Стажер-программист', 'Техподдержка'],
  creative: ['Стажер-дизайнер', 'SMM-помощник', 'Фотограф'],
  administrative: ['Помощник библиотекаря', 'Ассистент офиса', 'Архивариус']
};

export default function Index() {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'dashboard'>('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [testStep, setTestStep] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({
    social: 0,
    technical: 0,
    creative: 0,
    administrative: 0
  });

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: User = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      age: parseInt(formData.get('age') as string),
      testCompleted: false,
      recommendedJobs: []
    };
    setUser(newUser);
    setCurrentView('dashboard');
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser({
      name: 'Александр',
      email: 'alex@mail.ru',
      age: 16,
      testCompleted: true,
      recommendedJobs: ['Помощник в кофейне', 'Промоутер', 'Помощник на ресепшн']
    });
    setCurrentView('dashboard');
  };

  const handleTestAnswer = (category: string) => {
    setTestAnswers(prev => ({
      ...prev,
      [category]: prev[category] + 1
    }));

    if (testStep < careerTest.length - 1) {
      setTestStep(testStep + 1);
    } else {
      const maxCategory = Object.entries(testAnswers).reduce((a, b) => 
        testAnswers[a[0]] > testAnswers[b[0]] ? a : b
      )[0] as keyof typeof careerRecommendations;
      
      if (user) {
        setUser({
          ...user,
          testCompleted: true,
          recommendedJobs: careerRecommendations[maxCategory]
        });
      }
      setTestStep(0);
      setTestAnswers({ social: 0, technical: 0, creative: 0, administrative: 0 });
    }
  };

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-black">
        <header className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Icon name="Briefcase" size={28} className="text-primary" />
              <h1 className="text-2xl font-bold text-white">Успех 14</h1>
            </div>
            <Button onClick={() => setCurrentView('auth')} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Войти
            </Button>
          </div>
        </header>

        <main>
          <section className="py-24 px-4">
            <div className="container mx-auto text-center max-w-4xl">
              <Badge className="mb-6 bg-primary/20 text-primary border-primary" variant="outline">
                Для молодёжи 14-17 лет
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Найди свою первую работу
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Платформа для трудоустройства подростков. Пройди профориентационный тест и получи персональные рекомендации вакансий
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" onClick={() => setCurrentView('auth')} className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6">
                  Начать сейчас
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-900 text-lg px-8 py-6">
                  Узнать больше
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-gray-950">
            <div className="container mx-auto max-w-6xl">
              <h3 className="text-3xl font-bold text-center mb-12 text-white">Почему Успех 14?</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-card border-gray-800">
                  <CardHeader>
                    <Icon name="Shield" size={40} className="text-primary mb-4" />
                    <CardTitle className="text-white">Безопасно</CardTitle>
                    <CardDescription className="text-gray-400">
                      Все вакансии проверены. Работа только для подростков 14-17 лет по закону РФ
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-card border-gray-800">
                  <CardHeader>
                    <Icon name="Target" size={40} className="text-primary mb-4" />
                    <CardTitle className="text-white">Профориентация</CardTitle>
                    <CardDescription className="text-gray-400">
                      Пройди тест и узнай, какая работа подходит именно тебе
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-card border-gray-800">
                  <CardHeader>
                    <Icon name="Clock" size={40} className="text-primary mb-4" />
                    <CardTitle className="text-white">Гибкий график</CardTitle>
                    <CardDescription className="text-gray-400">
                      Работа совместима с учёбой. Выбирай удобное время
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <h3 className="text-3xl font-bold text-center mb-4 text-white">Актуальные вакансии</h3>
              <p className="text-center text-gray-400 mb-12">Зарегистрируйся, чтобы откликнуться</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockJobs.slice(0, 3).map(job => (
                  <Card key={job.id} className="bg-card border-gray-800 hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white">{job.title}</CardTitle>
                      <CardDescription className="text-gray-400">{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Icon name="MapPin" size={16} />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Icon name="Clock" size={16} />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          <Icon name="Banknote" size={16} />
                          {job.salary}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-800 py-8 px-4">
          <div className="container mx-auto text-center text-gray-400">
            <p>&copy; 2024 Успех 14. Платформа для трудоустройства молодёжи</p>
          </div>
        </footer>
      </div>
    );
  }

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="Briefcase" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold text-white">Успех 14</h1>
            </div>
            <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary">Вход</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <Input id="login-email" type="email" placeholder="your@email.com" required className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Пароль</Label>
                    <Input id="login-password" type="password" required className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Войти</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Имя</Label>
                    <Input id="name" name="name" placeholder="Александр" required className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="your@email.com" required className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">Возраст</Label>
                    <Input id="age" name="age" type="number" min="14" max="17" placeholder="16" required className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Пароль</Label>
                    <Input id="password" name="password" type="password" required className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Зарегистрироваться</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="ghost" onClick={() => setCurrentView('home')} className="text-gray-400 hover:text-white">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Briefcase" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-white">Успех 14</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Привет, {user?.name}!</span>
            <Button variant="ghost" onClick={() => { setUser(null); setCurrentView('home'); }} className="text-gray-400 hover:text-white">
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vacancies" className="w-full">
          <TabsList className="bg-gray-900 mb-8">
            <TabsTrigger value="vacancies" className="data-[state=active]:bg-primary">
              <Icon name="Briefcase" size={18} className="mr-2" />
              Вакансии
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-primary">
              <Icon name="Target" size={18} className="mr-2" />
              Профориентация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vacancies">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Все вакансии</h2>
                <Input placeholder="Поиск..." className="max-w-xs bg-gray-900 border-gray-700 text-white" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockJobs.map(job => (
                  <Card key={job.id} className="bg-card border-gray-800 hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white">{job.title}</CardTitle>
                      <CardDescription className="text-gray-400">{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Icon name="MapPin" size={16} />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Icon name="Clock" size={16} />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <Icon name="Banknote" size={16} />
                            {job.salary}
                          </div>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Откликнуться
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="max-w-2xl mx-auto bg-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Мой профиль</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-400">Имя</Label>
                    <p className="text-white text-lg">{user?.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <p className="text-white text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Возраст</Label>
                    <p className="text-white text-lg">{user?.age} лет</p>
                  </div>
                </div>

                {user?.testCompleted && user.recommendedJobs.length > 0 && (
                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-xl font-semibold mb-3 text-white">Рекомендованные профессии</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.recommendedJobs.map((job, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/20 text-primary border-primary">
                          {job}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card className="max-w-2xl mx-auto bg-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Профориентационный тест</CardTitle>
                <CardDescription className="text-gray-400">
                  Ответь на несколько вопросов, чтобы узнать, какая работа тебе подходит
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.testCompleted ? (
                  <div className="text-center space-y-6 py-8">
                    <Icon name="CheckCircle" size={64} className="text-primary mx-auto" />
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-white">Тест пройден!</h3>
                      <p className="text-gray-400 mb-4">Результаты сохранены в твоём профиле</p>
                      <Button 
                        onClick={() => {
                          if (user) {
                            setUser({ ...user, testCompleted: false, recommendedJobs: [] });
                          }
                        }} 
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Пройти заново
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Вопрос {testStep + 1} из {careerTest.length}</span>
                        <span>{Math.round(((testStep) / careerTest.length) * 100)}%</span>
                      </div>
                      <Progress value={(testStep / careerTest.length) * 100} className="h-2" />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-white">{careerTest[testStep].question}</h3>
                      <div className="space-y-3">
                        {careerTest[testStep].options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleTestAnswer(option.category)}
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-4 border-gray-700 hover:border-primary hover:bg-primary/10 text-white"
                          >
                            <span className="mr-3 text-primary font-bold">{String.fromCharCode(65 + index)}</span>
                            {option.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
