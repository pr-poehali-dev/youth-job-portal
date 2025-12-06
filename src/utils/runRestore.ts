import { restoreDefaultJobs } from './restoreDefaultJobs';

// Функция для ручного запуска восстановления
export async function runRestore() {
  console.log('🚀 Запуск восстановления вакансий...');
  localStorage.removeItem('default_jobs_restored');
  
  const result = await restoreDefaultJobs();
  
  console.log(`✅ Восстановление завершено: ${result.successCount} успешно, ${result.failCount} ошибок`);
  if (result.successCount > 0) {
    localStorage.setItem('default_jobs_restored', 'true');
    console.log('✅ Флаг восстановления установлен');
    // Перезагрузка страницы через 2 секунды
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  
  return result;
}
