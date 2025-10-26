import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'employer';
  timestamp: Date;
}

interface JobInfo {
  id: number;
  title: string;
  company: string;
}

const jobsInfo: Record<number, JobInfo> = {
  1: { id: 1, title: 'Помощник в кофейне', company: 'Coffee House' },
  2: { id: 2, title: 'Курьер', company: 'Delivery Express' },
  14: { id: 14, title: 'Стажер программист', company: 'IT StartUp' }
};

const employerResponses = [
  'Здравствуйте! Спасибо за интерес к нашей вакансии. Расскажите немного о себе.',
  'Отлично! У вас есть опыт работы в этой сфере?',
  'Какой график вам подходит?',
  'Когда вы могли бы приступить к работе?',
  'Отлично! Давайте назначим время для собеседования. Вам удобно в будни или выходные?',
  'Отличный выбор! Я запишу вас на собеседование. Мы свяжемся с вами в ближайшее время.'
];

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я увидел вашу вакансию и хотел бы откликнуться.',
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: 2,
      text: 'Здравствуйте! Рады вашему интересу. Расскажите, пожалуйста, немного о себе.',
      sender: 'employer',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseIndexRef = useRef(2);

  const jobInfo = id ? jobsInfo[Number(id)] : null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const responseIndex = Math.min(
        responseIndexRef.current,
        employerResponses.length - 1
      );
      
      const employerMessage: Message = {
        id: messages.length + 2,
        text: employerResponses[responseIndex],
        sender: 'employer',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, employerMessage]);
      setIsTyping(false);
      responseIndexRef.current = Math.min(
        responseIndexRef.current + 1,
        employerResponses.length - 1
      );
    }, 1500 + Math.random() * 1000);
  };

  if (!jobInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Чат не найден</h2>
          <Link to="/vacancies">
            <Button>Вернуться к вакансиям</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-lg">{jobInfo.company}</h1>
              <p className="text-sm text-muted-foreground">{jobInfo.title}</p>
            </div>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <Icon name="User" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-secondary/10">
        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Введите сообщение..."
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!inputValue.trim()}>
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
