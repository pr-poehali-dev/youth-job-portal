-- Создание таблицы для откликов на вакансии
CREATE TABLE IF NOT EXISTS t_p86122027_youth_job_portal.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    user_age INTEGER,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON t_p86122027_youth_job_portal.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON t_p86122027_youth_job_portal.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON t_p86122027_youth_job_portal.applications(created_at DESC);