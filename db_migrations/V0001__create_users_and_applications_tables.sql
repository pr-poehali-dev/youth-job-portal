-- Таблица пользователей
CREATE TABLE IF NOT EXISTS t_p86122027_youth_job_portal.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(50),
    test_result VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица откликов на вакансии
CREATE TABLE IF NOT EXISTS t_p86122027_youth_job_portal.job_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p86122027_youth_job_portal.users(id),
    job_id INTEGER NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- Индексы для быстрого поиска
CREATE INDEX idx_users_email ON t_p86122027_youth_job_portal.users(email);
CREATE INDEX idx_applications_user_id ON t_p86122027_youth_job_portal.job_applications(user_id);
CREATE INDEX idx_applications_job_id ON t_p86122027_youth_job_portal.job_applications(job_id);
CREATE INDEX idx_applications_status ON t_p86122027_youth_job_portal.job_applications(status);