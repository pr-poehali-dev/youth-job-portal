-- Изменение типов колонок в таблице messages с UUID на VARCHAR

ALTER TABLE t_p86122027_youth_job_portal.messages 
    ALTER COLUMN sender_id TYPE VARCHAR(255),
    ALTER COLUMN receiver_id TYPE VARCHAR(255);