-- Создание таблицы для сообщений чата между работниками и работодателями
CREATE TABLE IF NOT EXISTS t_p86122027_youth_job_portal.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    job_id VARCHAR(255),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON t_p86122027_youth_job_portal.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON t_p86122027_youth_job_portal.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_job_id ON t_p86122027_youth_job_portal.messages(job_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON t_p86122027_youth_job_portal.messages(created_at DESC);