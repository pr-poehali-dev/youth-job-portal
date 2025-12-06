-- Добавление тестового собеседования для проверки отображения
INSERT INTO t_p86122027_youth_job_portal.interviews 
(user_id, job_id, user_name, user_email, user_age, job_title, interview_date, location, notes, created_at) 
VALUES 
('8', '1765017464885_45', 'Александр Петров', 'alex@example.com', 19, 'Бариста', '2025-12-10 14:00:00', 'Офис компании', 'Собеседование назначено работодателем', NOW());