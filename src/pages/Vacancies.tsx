import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import VacancyMap from '@/components/VacancyMap';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  ageRange: string;
  salary: string;
  category: string;
  coordinates: [number, number];
}

const allJobs: Job[] = [
  { id: 1, title: 'Помощник в кофейне', company: 'Coffee House', location: 'Красноярск, ул. Ленина, 45', type: 'Частичная', ageRange: '14-17', salary: '28000 ₽', category: 'Работа с людьми', coordinates: [56.0184, 92.8672] },
  { id: 2, title: 'Курьер', company: 'Delivery Express', location: 'Красноярск, все районы', type: 'Гибкий график', ageRange: '16-17', salary: '45000 ₽', category: 'Активная работа', coordinates: [56.0153, 92.8932] },
  { id: 3, title: 'Промоутер', company: 'Marketing Pro', location: 'Красноярск, пр. Мира, 120', type: 'Проектная', ageRange: '14-17', salary: '35000 ₽', category: 'Активная работа', coordinates: [56.0089, 92.8526] },
  { id: 4, title: 'Помощник библиотекаря', company: 'Городская библиотека', location: 'Красноярск, ул. Карла Маркса, 114', type: 'Частичная', ageRange: '14-16', salary: '25000 ₽', category: 'Работа с людьми', coordinates: [56.0121, 92.8734] },
  { id: 5, title: 'Стажер-дизайнер', company: 'Creative Studio', location: 'Красноярск, ул. Молокова, 1', type: 'Стажировка', ageRange: '15-17', salary: '38000 ₽', category: 'Творчество и дизайн', coordinates: [56.0297, 92.9107] },
  { id: 6, title: 'Помощник на ресепшн', company: 'Sport Complex', location: 'Красноярск, ул. Партизана Железняка, 23', type: 'Частичная', ageRange: '16-17', salary: '32000 ₽', category: 'Работа с людьми', coordinates: [56.0264, 92.8653] },
  { id: 7, title: 'Расклейщик объявлений', company: 'AdCity', location: 'Красноярск, различные районы', type: 'Проектная', ageRange: '14-17', salary: '30000 ₽', category: 'Активная работа', coordinates: [56.0109, 92.8520] },
  { id: 8, title: 'Помощник в зоомагазине', company: 'Pet Shop', location: 'Красноярск, ул. Взлётная, 28', type: 'Частичная', ageRange: '14-17', salary: '27000 ₽', category: 'Работа с людьми', coordinates: [56.0421, 92.9187] },
  { id: 9, title: 'Оператор call-центра', company: 'TechSupport24', location: 'Красноярск, ул. Ленина, 150', type: 'Гибкий график', ageRange: '16-17', salary: '42000 ₽', category: 'Работа с людьми', coordinates: [56.0157, 92.8801] },
  { id: 10, title: 'Помощник флориста', company: 'Цветочный рай', location: 'Красноярск, ул. Маерчака, 18', type: 'Частичная', ageRange: '14-17', salary: '29000 ₽', category: 'Творчество и дизайн', coordinates: [56.0118, 92.8692] },
  { id: 11, title: 'SMM-помощник', company: 'Digital Agency', location: 'Красноярск, ул. Урицкого, 61', type: 'Стажировка', ageRange: '15-17', salary: '40000 ₽', category: 'IT и технологии', coordinates: [56.0198, 92.8712] },
  { id: 12, title: 'Раздатчик флаеров', company: 'Promo Team', location: 'Красноярск, центр города', type: 'Проектная', ageRange: '14-17', salary: '26000 ₽', category: 'Активная работа', coordinates: [56.0106, 92.8526] },
  { id: 13, title: 'Помощник фотографа', company: 'Photo Studio Pro', location: 'Красноярск, ул. Ломоносова, 4', type: 'Частичная', ageRange: '15-17', salary: '36000 ₽', category: 'Творчество и дизайн', coordinates: [56.0231, 92.8901] },
  { id: 14, title: 'Стажер программист', company: 'IT StartUp', location: 'Красноярск, пр. Мира, 25', type: 'Стажировка', ageRange: '16-17', salary: '60000 ₽', category: 'IT и технологии', coordinates: [56.0194, 92.8634] },
  { id: 15, title: 'Помощник в кинотеатре', company: 'Cinema Park', location: 'Красноярск, ул. 9 Мая, 77', type: 'Частичная', ageRange: '14-17', salary: '31000 ₽', category: 'Работа с людьми', coordinates: [56.0333, 92.9123] },
  { id: 16, title: 'Упаковщик товаров', company: 'Warehouse Plus', location: 'Красноярск, ул. Семафорная, 433', type: 'Гибкий график', ageRange: '16-17', salary: '43000 ₽', category: 'Активная работа', coordinates: [55.9987, 92.8234] },
  { id: 17, title: 'Помощник аниматора', company: 'Kids Party', location: 'Красноярск, ул. Копылова, 78', type: 'Проектная', ageRange: '14-17', salary: '34000 ₽', category: 'Работа с людьми', coordinates: [56.0274, 92.8523] },
  { id: 18, title: 'Контент-модератор', company: 'Social Media Corp', location: 'Красноярск, ул. Весны, 7', type: 'Гибкий график', ageRange: '16-17', salary: '39000 ₽', category: 'IT и технологии', coordinates: [56.0389, 92.9287] },
  { id: 19, title: 'Помощник в ветклинике', company: 'Вет-Центр', location: 'Красноярск, ул. Академика Киренского, 2', type: 'Частичная', ageRange: '15-17', salary: '33000 ₽', category: 'Работа с людьми', coordinates: [56.0456, 92.9345] },
  { id: 20, title: 'Стажер видеомонтажер', company: 'Video Production', location: 'Красноярск, ул. Дубровинского, 110', type: 'Стажировка', ageRange: '15-17', salary: '48000 ₽', category: 'Творчество и дизайн', coordinates: [56.0087, 92.8443] },
  { id: 21, title: 'Помощник в магазине', company: 'Продукты 24', location: 'Красноярск, ул. Алексеева, 95', type: 'Частичная', ageRange: '14-17', salary: '30000 ₽', category: 'Работа с людьми', coordinates: [56.0521, 92.9112] },
  { id: 22, title: 'Тестировщик игр', company: 'Game Studio', location: 'Красноярск, ул. Телевизорная, 1', type: 'Проектная', ageRange: '14-17', salary: '52000 ₽', category: 'IT и технологии', coordinates: [56.0267, 92.9234] },
  { id: 23, title: 'Помощник тренера', company: 'Fitness Club', location: 'Красноярск, ул. Авиаторов, 19', type: 'Частичная', ageRange: '16-17', salary: '35000 ₽', category: 'Активная работа', coordinates: [56.0178, 92.8456] },
  { id: 24, title: 'Оператор соцсетей', company: 'Brand Media', location: 'Красноярск, ул. Мичурина, 2', type: 'Гибкий график', ageRange: '15-17', salary: '44000 ₽', category: 'IT и технологии', coordinates: [56.0241, 92.8789] },
];

const Vacancies = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || job.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const recommendedJobs = user?.testResult 
    ? allJobs.filter(job => job.category === user.testResult)
    : [];

  const types = Array.from(new Set(allJobs.map(job => job.type)));

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Успех 14</Link>
          <div className="flex gap-3">
            {user ? (
              <Link to="/profile">
                <Button variant="outline">
                  <Icon name="User" size={16} className="mr-2" />
                  Личный кабинет
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button>Регистрация</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Вакансии в Красноярске</h1>
          <p className="text-muted-foreground text-lg">
            {allJobs.length} доступных вакансий для подростков 14-17 лет
          </p>
        </div>

        {user?.testResult && recommendedJobs.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Icon name="Sparkles" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Рекомендовано для вас</h3>
                <p className="text-muted-foreground mb-3">
                  На основе вашего теста: {user.testResult}
                </p>
                <p className="text-sm text-muted-foreground">
                  Найдено {recommendedJobs.length} подходящих вакансий
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск вакансий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              onClick={() => setSelectedType(null)}
              size="sm"
            >
              Все
            </Button>
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Icon name="List" size={16} />
              Список
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Icon name="Map" size={16} />
              На карте
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const isRecommended = user?.testResult && job.category === user.testResult;
                
                return (
                  <div
                    key={job.id}
                    className={`bg-card p-6 rounded-lg border ${
                      isRecommended 
                        ? 'border-primary shadow-lg shadow-primary/10' 
                        : 'border-border'
                    } hover:border-primary/50 transition`}
                  >
                    {isRecommended && (
                      <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                        <Icon name="Star" size={12} className="mr-1" />
                        Рекомендовано
                      </Badge>
                    )}
                    
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-muted-foreground mb-4">{job.company}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="MapPin" size={16} className="text-muted-foreground" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Clock" size={16} className="text-muted-foreground" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Users" size={16} className="text-muted-foreground" />
                        <span>{job.ageRange} лет</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-lg font-bold text-primary">{job.salary}</span>
                      <Link to={`/job/${job.id}`}>
                        <Button size="sm">
                          Подробнее
                          <Icon name="ArrowRight" size={14} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-muted/50 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Icon name="Search" size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Вакансии не найдены</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <VacancyMap jobs={filteredJobs} recommendedCategory={user?.testResult} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Vacancies;
