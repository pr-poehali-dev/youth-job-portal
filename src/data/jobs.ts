export interface Job {
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

export interface JobDetails extends Job {
  description: string;
  requirements: string[];
  responsibilities: string[];
  conditions: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export const allJobs: Job[] = [
  { id: 1, title: 'Помощник в кофейне', company: 'Coffee House', location: 'Красноярск, ул. Ленина, 45', type: 'Частичная', ageRange: '14-17', salary: '28000 ₽', category: 'Работа с людьми', coordinates: [56.0184, 92.8672] },
  { id: 2, title: 'Курьер', company: 'Delivery Express', location: 'Красноярск, все районы', type: 'Гибкий график', ageRange: '16-17', salary: '45000 ₽', category: 'Активная работа', coordinates: [56.0153, 92.8932] },
  { id: 14, title: 'Стажер программист', company: 'IT StartUp', location: 'Красноярск, удалённо', type: 'Стажировка', ageRange: '16-17', salary: '60000 ₽', category: 'IT и технологии', coordinates: [56.0194, 92.8634] },
];

export const jobsDetails: Record<number, JobDetails> = {
  1: {
    id: 1,
    title: 'Помощник в кофейне',
    company: 'Coffee House',
    location: 'Красноярск, ул. Ленина, 45',
    type: 'Частичная',
    ageRange: '14-17',
    salary: '28000 ₽',
    category: 'Работа с людьми',
    coordinates: [56.0184, 92.8672],
    description: 'Ищем энергичного и общительного помощника в нашу уютную кофейню. Работа в дневное время, совместима с учёбой.',
    requirements: [
      'Возраст 14-17 лет',
      'Коммуникабельность и дружелюбие',
      'Готовность работать в команде',
      'Аккуратность и ответственность'
    ],
    responsibilities: [
      'Помощь в обслуживании клиентов',
      'Поддержание чистоты в зале',
      'Помощь бариста в приготовлении напитков',
      'Подача заказов'
    ],
    conditions: [
      'График: 3-4 часа в день, 3-4 раза в неделю',
      'Гибкий график с учётом учёбы',
      'Обучение за счёт компании',
      'Бесплатные напитки во время смены',
      'Дружный коллектив'
    ],
    contact: {
      phone: '+7 (391) 234-56-78',
      email: 'hr@coffeehouse-krsk.ru'
    }
  },
  2: {
    id: 2,
    title: 'Курьер',
    company: 'Delivery Express',
    location: 'Красноярск, все районы',
    type: 'Гибкий график',
    ageRange: '16-17',
    salary: '45000 ₽',
    category: 'Активная работа',
    coordinates: [56.0153, 92.8932],
    description: 'Требуются курьеры для доставки заказов по городу. Высокий доход, свободный график.',
    requirements: [
      'Возраст 16-17 лет',
      'Наличие велосипеда/самоката (можно арендовать)',
      'Знание города',
      'Ответственность и пунктуальность',
      'Наличие смартфона'
    ],
    responsibilities: [
      'Доставка заказов клиентам',
      'Общение с клиентами',
      'Работа с мобильным приложением',
      'Соблюдение сроков доставки'
    ],
    conditions: [
      'График: выбираешь сам удобные смены',
      'Оплата за каждый заказ + бонусы',
      'Можно работать после школы и в выходные',
      'Предоставление термосумки',
      'Еженедельные выплаты'
    ],
    contact: {
      phone: '+7 (391) 345-67-89',
      email: 'job@delivery-express.ru'
    }
  },
  14: {
    id: 14,
    title: 'Стажер программист',
    company: 'IT StartUp',
    location: 'Красноярск, удалённо',
    type: 'Стажировка',
    ageRange: '16-17',
    salary: '60000 ₽',
    category: 'IT и технологии',
    coordinates: [56.0194, 92.8634],
    description: 'Стартап в сфере разработки веб-приложений ищет талантливого стажёра-программиста. Отличная возможность начать карьеру в IT.',
    requirements: [
      'Возраст 16-17 лет',
      'Базовые знания HTML, CSS, JavaScript',
      'Желание учиться и развиваться',
      'Ответственность и самостоятельность',
      'Английский язык на уровне чтения документации'
    ],
    responsibilities: [
      'Разработка простых веб-компонентов',
      'Исправление багов под руководством наставника',
      'Участие в code review',
      'Изучение новых технологий',
      'Работа с системами контроля версий (Git)'
    ],
    conditions: [
      'График: 4 часа в день, удалённо',
      'Гибкий график с учётом учёбы',
      'Обучение от опытных разработчиков',
      'Современный стек технологий',
      'Возможность роста до junior-разработчика',
      'Участие в реальных проектах'
    ],
    contact: {
      phone: '+7 (391) 456-78-90',
      email: 'hr@itstartup-krsk.ru'
    }
  }
};
