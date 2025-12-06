/**
 * Утилита для очистки localStorage от старых данных пользователей
 * Использование: вызвать clearLocalStorageUsers() в консоли браузера
 */

export const clearLocalStorageUsers = () => {
  console.log('🧹 Очистка localStorage от пользователей...');
  
  const beforeUsers = localStorage.getItem('users');
  console.log('📋 Пользователи до очистки:', beforeUsers);
  
  localStorage.removeItem('users');
  localStorage.removeItem('user');
  
  console.log('✅ localStorage очищен. Перезагрузите страницу.');
};

// Экспортируем в window для доступа из консоли
if (typeof window !== 'undefined') {
  (window as any).clearLocalStorageUsers = clearLocalStorageUsers;
  console.log('💡 Для очистки localStorage введите в консоли: clearLocalStorageUsers()');
}
