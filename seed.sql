-- ============================================================
-- OrtoApp - Dados iniciais para demonstração (MVP)
-- Execute após schema.sql:
--   mysql -u root < schema.sql
--   mysql -u root < seed.sql
-- ============================================================

USE ortoapp;

-- Migração leve: adiciona coluna symptoms se o banco já existia antes
ALTER TABLE pain_records ADD COLUMN IF NOT EXISTS symptoms TEXT NULL AFTER pain_level;

-- Paciente de teste
INSERT INTO users (id, name, email, password_hash, role, goal)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'João Silva',
  'joao.silva@email.com',
  'demo_hash_sem_auth',
  'patient',
  'Recuperação lombar'
) ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Catálogo de sintomas
INSERT INTO symptoms (id, name, description, body_region) VALUES
  ('22222222-2222-2222-2222-222222222221', 'Dor Lombar', 'Dor frequente na região inferior das costas', 'coluna'),
  ('22222222-2222-2222-2222-222222222222', 'Dor Cervical', 'Desconforto e tensão na região do pescoço', 'pescoço'),
  ('22222222-2222-2222-2222-222222222223', 'Dor no Joelho', 'Desconforto articular no joelho', 'joelho'),
  ('22222222-2222-2222-2222-222222222224', 'Rigidez Matinal', 'Dificuldade de movimento ao acordar', 'geral')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Categorias
INSERT INTO exercise_categories (id, name) VALUES
  ('33333333-3333-3333-3333-333333333331', 'Reabilitação'),
  ('33333333-3333-3333-3333-333333333332', 'Orientações Educativas')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Exercícios
INSERT INTO exercises (id, category_id, name, description, duration_minutes, difficulty) VALUES
  ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 'Alongamento Lombar', 'Alongamento suave para aliviar tensão na lombar.', 10, 'beginner'),
  ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333331', 'Mobilidade Cervical', 'Movimentos lentos para relaxar o pescoço.', 8, 'beginner'),
  ('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333331', 'Fortalecimento do Joelho', 'Exercícios leves de estabilização.', 15, 'intermediate'),
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333331', 'Alongamento de Ombro', 'Melhora amplitude de movimento do ombro.', 12, 'beginner')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Orientações educativas (mesma tabela exercises, categoria diferente)
INSERT INTO exercises (id, category_id, name, description, duration_minutes, difficulty) VALUES
  ('55555555-5555-5555-5555-555555555551', '33333333-3333-3333-3333-333333333332', 'Siga exercícios profissionais', 'Realize apenas exercícios indicados por um profissional de saúde.', NULL, 'beginner'),
  ('55555555-5555-5555-5555-555555555552', '33333333-3333-3333-3333-333333333332', 'Evite esforço excessivo', 'Respeite seus limites e não force movimentos dolorosos.', NULL, 'beginner'),
  ('55555555-5555-5555-5555-555555555553', '33333333-3333-3333-3333-333333333332', 'Repouso quando recomendado', 'Mantenha repouso quando orientado pelo profissional.', NULL, 'beginner'),
  ('55555555-5555-5555-5555-555555555554', '33333333-3333-3333-3333-333333333332', 'Observe sinais de piora', 'Fique atento a sintomas que aumentem ou persistam.', NULL, 'beginner'),
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333332', 'Procure atendimento', 'Em caso de dor intensa ou sintomas graves, busque atendimento médico.', NULL, 'beginner')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Registros de dor de exemplo
INSERT INTO pain_records (id, user_id, pain_level, symptoms, notes, recorded_at) VALUES
  ('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', 6, 'Dor lombar, rigidez', 'Piora após ficar muito tempo sentado.', DATE_SUB(NOW(), INTERVAL 3 DAY)),
  ('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', 4, 'Dor lombar leve', 'Melhorou com alongamento.', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE pain_level = VALUES(pain_level);
