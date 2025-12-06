-- Добавляем поле role в таблицу users для разделения работников и работодателей
ALTER TABLE t_p86122027_youth_job_portal.users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Создаём индекс для быстрого поиска по роли
CREATE INDEX IF NOT EXISTS idx_users_role ON t_p86122027_youth_job_portal.users(role);

-- Добавляем работодателя mininkonstantin@gmail.com
INSERT INTO t_p86122027_youth_job_portal.users (email, password_hash, full_name, date_of_birth, phone, role, created_at, updated_at)
VALUES ('mininkonstantin@gmail.com', 'secure_password_123', 'Константин Минин', '1990-01-01', '+79999999999', 'employer', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET role = 'employer';
