import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { allJobs } from '@/data/jobs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'employer';
  timestamp: number;
}

const jobsInfo = Object.fromEntries(
  allJobs.map(job => [job.id, { id: job.id, title: job.title, company: job.company }])
);

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const jobInfo = id ? jobsInfo[Number(id)] : null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const otherUserId = urlParams.get('userId');
  
  const chatPartnerId = user?.role === 'employer' ? otherUserId : user?.id;
  const chatKey = `chat_${id}_${chatPartnerId}`;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadMessages = () => {
      const savedMessages = localStorage.getItem(chatKey);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, [chatKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim() || !user) return;

    const newMessage: Message = {
      id: `${Date.now()}_${user.id}`,
      text: inputValue,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role === 'employer' ? 'employer' : 'user',
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    setInputValue('');
  };

  const scheduleInterview = () => {
    if (!interviewDate || !interviewTime || !user) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const responseUser = users.find((u: any) => u.id === chatPartnerId);

    if (!responseUser) return;

    const interviewData = {
      userId: responseUser.id,
      userName: responseUser.name,
      userEmail: responseUser.email,
      jobId: Number(id),
      jobTitle: jobInfo?.title || '',
      date: interviewDate,
      time: interviewTime,
      status: 'pending',
      timestamp: Date.now()
    };

    const allInterviews = JSON.parse(localStorage.getItem('all_interviews') || '[]');
    allInterviews.push(interviewData);
    localStorage.setItem('all_interviews', JSON.stringify(allInterviews));

    const confirmMessage: Message = {
      id: `${Date.now()}_${user.id}`,
      text: `📅 Собеседование назначено на ${new Date(interviewDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} в ${interviewTime}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'employer',
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, confirmMessage];
    setMessages(updatedMessages);
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    setIsDialogOpen(false);
    setInterviewDate('');
    setInterviewTime('');
  };

  const requestInterview = () => {
    if (!interviewDate || !interviewTime || !user) return;

    const requestMessage: Message = {
      id: `${Date.now()}_${user.id}`,
      text: `🙋 Прошу назначить собеседование на ${new Date(interviewDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} в ${interviewTime}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'user',
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, requestMessage];
    setMessages(updatedMessages);
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    setIsDialogOpen(false);
    setInterviewDate('');
    setInterviewTime('');
  };

  if (!user) return null;

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

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const chatPartner = users.find((u: any) => u.id === chatPartnerId);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(user.role === 'employer' ? '/employer-profile' : '/vacancies')}
              className="flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="hidden sm:inline">Назад</span>
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-lg">
                {user.role === 'employer' && chatPartner ? chatPartner.name : jobInfo.company}
              </h1>
              <p className="text-sm text-muted-foreground">{jobInfo.title}</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <Icon name="Calendar" size={16} className="mr-2" />
                  {user.role === 'employer' ? 'Назначить собеседование' : 'Запросить собеседование'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {user.role === 'employer' ? 'Назначить собеседование' : 'Запросить собеседование'}
                  </DialogTitle>
                  <DialogDescription>
                    {user.role === 'employer' 
                      ? 'Укажите дату и время для встречи с кандидатом'
                      : 'Предложите удобную дату и время для собеседования'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Дата</Label>
                    <Input
                      id="date"
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Время</Label>
                    <Input
                      id="time"
                      type="time"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button 
                    onClick={user.role === 'employer' ? scheduleInterview : requestInterview} 
                    disabled={!interviewDate || !interviewTime}
                  >
                    {user.role === 'employer' ? 'Назначить' : 'Отправить запрос'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">Чат пуст</p>
              <p className="text-sm text-muted-foreground">
                Отправьте первое сообщение чтобы начать диалог
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isMyMessage = message.senderId === user.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      isMyMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    {!isMyMessage && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMyMessage
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })
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