-- Создаем таблицу для вакансий
CREATE TABLE IF NOT EXISTS t_p86122027_youth_job_portal.jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    salary TEXT,
    description TEXT NOT NULL,
    requirements TEXT[],
    employer_id TEXT,
    employer_email TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создаем таблицу для откликов
CREATE TABLE IF NOT EXISTS t_p86122027_youth_job_portal.job_responses (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    job_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_age INTEGER,
    job_title TEXT NOT NULL,
    test_score INTEGER,
    test_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Создаем таблицу для собеседований
CREATE TABLE IF NOT EXISTS t_p86122027_youth_job_portal.interviews (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    job_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_age INTEGER,
    job_title TEXT NOT NULL,
    interview_date TIMESTAMP NOT NULL,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_jobs_employer ON t_p86122027_youth_job_portal.jobs(employer_email);
CREATE INDEX IF NOT EXISTS idx_responses_job ON t_p86122027_youth_job_portal.job_responses(job_id);
CREATE INDEX IF NOT EXISTS idx_responses_user ON t_p86122027_youth_job_portal.job_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_job ON t_p86122027_youth_job_portal.interviews(job_id);
