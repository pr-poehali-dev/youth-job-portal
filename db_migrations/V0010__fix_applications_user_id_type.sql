-- Изменение типа колонки user_id в таблице applications с UUID на VARCHAR

ALTER TABLE t_p86122027_youth_job_portal.applications 
    ALTER COLUMN user_id TYPE VARCHAR(255);