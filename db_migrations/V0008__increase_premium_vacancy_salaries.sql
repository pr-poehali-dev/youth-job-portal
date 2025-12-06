-- Увеличиваем зарплату в премиум-вакансиях чтобы они были привлекательнее
UPDATE t_p86122027_youth_job_portal.jobs
SET salary = '55000 ₽'
WHERE id = '1765017464885_32' AND is_premium = true;

UPDATE t_p86122027_youth_job_portal.jobs
SET salary = '60000 ₽'
WHERE id = '1765017464885_35' AND is_premium = true;

UPDATE t_p86122027_youth_job_portal.jobs
SET salary = '50000 ₽'
WHERE id = '1765017464885_36' AND is_premium = true;

UPDATE t_p86122027_youth_job_portal.jobs
SET salary = '55000 ₽'
WHERE id = '1765017464885_41' AND is_premium = true;
