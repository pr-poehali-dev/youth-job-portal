-- Добавляем недостающие поля в таблицу jobs
ALTER TABLE t_p86122027_youth_job_portal.jobs
ADD COLUMN age_range TEXT DEFAULT '14-17',
ADD COLUMN category TEXT DEFAULT 'Работа с людьми',
ADD COLUMN coordinates TEXT DEFAULT '[56.0184, 92.8672]',
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN contact_phone TEXT DEFAULT '+7 (391) 234-56-78',
ADD COLUMN contact_email TEXT DEFAULT 'hr@company.ru';
