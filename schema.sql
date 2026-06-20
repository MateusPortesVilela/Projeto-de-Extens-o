-- ============================================================
-- OrtoApp - Schema compatível com MariaDB/MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS ortoapp;

-- Garante uso do banco correto
USE ortoapp;

-- ============================================================
-- Tabela: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         CHAR(36)      NOT NULL DEFAULT (UUID()),
  name       VARCHAR(255)  NOT NULL,
  email      VARCHAR(255)  NOT NULL,
  password_hash TEXT        NOT NULL,
  role       VARCHAR(32)   NOT NULL CHECK (role IN ('patient', 'physiotherapist', 'doctor', 'admin')),
  is_active  BOOLEAN       NOT NULL DEFAULT TRUE,
  photo_url  TEXT          NULL,
  birth_date DATE          NULL,
  weight     DECIMAL(5,2)  NULL CHECK (weight >= 0),
  height     DECIMAL(4,2)  NULL CHECK (height >= 0),
  goal       TEXT          NULL,
  orthopedic_history TEXT  NULL,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME      NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);

CREATE INDEX idx_users_role ON users (role);

-- ============================================================
-- Tabela: symptoms
-- ============================================================
CREATE TABLE IF NOT EXISTS symptoms (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  name        VARCHAR(150) NOT NULL,
  description TEXT         NULL,
  body_region VARCHAR(100) NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_symptoms_name (name)
);

-- ============================================================
-- Tabela: patient_symptoms
-- ============================================================
CREATE TABLE IF NOT EXISTS patient_symptoms (
  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id     CHAR(36)  NOT NULL,
  symptom_id  CHAR(36)  NOT NULL,
  intensity   TINYINT   NOT NULL CHECK (intensity BETWEEN 0 AND 10),
  notes       TEXT      NULL,
  recorded_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME  NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_ps_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_ps_symptom FOREIGN KEY (symptom_id) REFERENCES symptoms(id) ON DELETE RESTRICT
);

CREATE INDEX idx_patient_symptoms_user_id    ON patient_symptoms (user_id);
CREATE INDEX idx_patient_symptoms_symptom_id ON patient_symptoms (symptom_id);
CREATE INDEX idx_patient_symptoms_recorded_at ON patient_symptoms (recorded_at);

-- ============================================================
-- Tabela: pain_records
-- ============================================================
CREATE TABLE IF NOT EXISTS pain_records (
  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id     CHAR(36)  NOT NULL,
  pain_level  TINYINT   NOT NULL CHECK (pain_level BETWEEN 0 AND 10),
  notes       TEXT      NULL,
  recorded_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME  NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_pr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_pain_records_user_id     ON pain_records (user_id);
CREATE INDEX idx_pain_records_recorded_at ON pain_records (recorded_at);

-- ============================================================
-- Tabela: exercise_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS exercise_categories (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  name       VARCHAR(150) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_exercise_categories_name (name)
);

-- ============================================================
-- Tabela: exercises
-- ============================================================
CREATE TABLE IF NOT EXISTS exercises (
  id                CHAR(36)     NOT NULL DEFAULT (UUID()),
  category_id       CHAR(36)     NOT NULL,
  name              VARCHAR(255) NOT NULL,
  description       TEXT         NULL,
  duration_minutes  INT          NULL CHECK (duration_minutes >= 0),
  difficulty        VARCHAR(32)  NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  video_url         TEXT         NULL,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_exercises_category_name (category_id, name),
  CONSTRAINT fk_ex_category FOREIGN KEY (category_id) REFERENCES exercise_categories(id) ON DELETE RESTRICT
);

CREATE INDEX idx_exercises_difficulty ON exercises (difficulty);

-- ============================================================
-- Tabela: exercise_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS exercise_sessions (
  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id     CHAR(36)  NOT NULL,
  exercise_id CHAR(36)  NOT NULL,
  completed   BOOLEAN   NOT NULL DEFAULT FALSE,
  started_at  DATETIME  NULL,
  finished_at DATETIME  NULL,
  notes       TEXT      NULL,
  created_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME  NULL,
  -- MariaDB 10.2+ suporta CHECK, mas não expressões com IS NULL entre colunas facilmente;
  -- a validação finished_at >= started_at é feita via trigger abaixo
  PRIMARY KEY (id),
  CONSTRAINT fk_es_user     FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  CONSTRAINT fk_es_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
);

-- Trigger para validar finished_at >= started_at (substitui o CHECK do PostgreSQL)
DROP TRIGGER IF EXISTS trg_exercise_sessions_check_dates;
DELIMITER $$
CREATE TRIGGER trg_exercise_sessions_check_dates
BEFORE INSERT ON exercise_sessions
FOR EACH ROW
BEGIN
  IF NEW.finished_at IS NOT NULL AND NEW.started_at IS NOT NULL AND NEW.finished_at < NEW.started_at THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'finished_at deve ser >= started_at';
  END IF;
END$$

CREATE TRIGGER trg_exercise_sessions_check_dates_upd
BEFORE UPDATE ON exercise_sessions
FOR EACH ROW
BEGIN
  IF NEW.finished_at IS NOT NULL AND NEW.started_at IS NOT NULL AND NEW.finished_at < NEW.started_at THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'finished_at deve ser >= started_at';
  END IF;
END$$
DELIMITER ;

CREATE INDEX idx_exercise_sessions_user_id     ON exercise_sessions (user_id);
CREATE INDEX idx_exercise_sessions_exercise_id ON exercise_sessions (exercise_id);
CREATE INDEX idx_exercise_sessions_completed   ON exercise_sessions (completed);

-- ============================================================
-- Tabela: attendance_calendar
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance_calendar (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id       CHAR(36)     NOT NULL,
  activity_date DATE         NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  notes         TEXT         NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME     NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_attendance (user_id, activity_date, activity_type),
  CONSTRAINT fk_ac_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_attendance_calendar_user_date ON attendance_calendar (user_id, activity_date);

-- ============================================================
-- Tabela: achievements
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  name        VARCHAR(150) NOT NULL,
  description TEXT         NOT NULL,
  icon        TEXT         NULL,
  criteria    JSON         NULL,        -- JSONB do Postgres → JSON no MariaDB
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_achievements_name (name)
);

-- ============================================================
-- Tabela: user_achievements
-- ============================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id             CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id        CHAR(36)  NOT NULL,
  achievement_id CHAR(36)  NOT NULL,
  unlocked_at    DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_achievement (user_id, achievement_id),
  CONSTRAINT fk_ua_user        FOREIGN KEY (user_id)        REFERENCES users(id)        ON DELETE CASCADE,
  CONSTRAINT fk_ua_achievement FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements (user_id);

-- ============================================================
-- Tabela: support_tickets
-- ============================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id     CHAR(36)     NULL,
  subject     VARCHAR(255) NOT NULL,
  message     TEXT         NOT NULL,
  status      VARCHAR(32)  NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority    VARCHAR(16)  NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at DATETIME     NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_st_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_support_tickets_status  ON support_tickets (status);
CREATE INDEX idx_support_tickets_user_id ON support_tickets (user_id);

-- ============================================================
-- Tabela: ticket_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS ticket_messages (
  id         CHAR(36)  NOT NULL DEFAULT (UUID()),
  ticket_id  CHAR(36)  NOT NULL,
  sender_id  CHAR(36)  NULL,
  message    TEXT      NOT NULL,
  created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_tm_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  CONSTRAINT fk_tm_sender FOREIGN KEY (sender_id) REFERENCES users(id)           ON DELETE SET NULL
);

CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages (ticket_id);
CREATE INDEX idx_ticket_messages_sender_id ON ticket_messages (sender_id);

-- ============================================================
-- Tabela: feedbacks
-- ============================================================
CREATE TABLE IF NOT EXISTS feedbacks (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id    CHAR(36)     NOT NULL,
  rating     TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT         NULL,
  context    VARCHAR(150) NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_fb_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_feedbacks_user_id ON feedbacks (user_id);