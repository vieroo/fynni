INSERT INTO "categories" ("id", "user_id", "name", "type", "icon", "color", "created_at")
VALUES
-- ======================
-- DESPESAS
-- ======================
(gen_random_uuid(), NULL, 'Alimentação', 'EXPENSE', 'utensils', NULL, NOW()),
(gen_random_uuid(), NULL, 'Restaurante', 'EXPENSE', 'restaurant', NULL, NOW()),
(gen_random_uuid(), NULL, 'Mercado', 'EXPENSE', 'shopping-cart', NULL, NOW()),

(gen_random_uuid(), NULL, 'Aluguel', 'EXPENSE', 'home', NULL, NOW()),
(gen_random_uuid(), NULL, 'Condomínio', 'EXPENSE', 'building', NULL, NOW()),
(gen_random_uuid(), NULL, 'Água', 'EXPENSE', 'droplet', NULL, NOW()),
(gen_random_uuid(), NULL, 'Luz', 'EXPENSE', 'zap', NULL, NOW()),
(gen_random_uuid(), NULL, 'Internet', 'EXPENSE', 'wifi', NULL, NOW()),

(gen_random_uuid(), NULL, 'Farmácia', 'EXPENSE', 'pill', NULL, NOW()),
(gen_random_uuid(), NULL, 'Plano de Saúde', 'EXPENSE', 'heart-pulse', NULL, NOW()),

(gen_random_uuid(), NULL, 'Transporte', 'EXPENSE', 'bus', NULL, NOW()),
(gen_random_uuid(), NULL, 'Combustível', 'EXPENSE', 'fuel', NULL, NOW()),
(gen_random_uuid(), NULL, 'Manutenção Veículo', 'EXPENSE', 'car', NULL, NOW()),

(gen_random_uuid(), NULL, 'Streaming', 'EXPENSE', 'tv', NULL, NOW()),
(gen_random_uuid(), NULL, 'Entretenimento', 'EXPENSE', 'gamepad-2', NULL, NOW()),

(gen_random_uuid(), NULL, 'Cartão de Crédito', 'EXPENSE', 'credit-card', NULL, NOW()),
(gen_random_uuid(), NULL, 'Empréstimos', 'EXPENSE', 'banknote', NULL, NOW()),

(gen_random_uuid(), NULL, 'Outros', 'EXPENSE', 'more-horizontal', NULL, NOW()),

-- ======================
-- RECEITAS
-- ======================
(gen_random_uuid(), NULL, 'Salário', 'INCOME', 'briefcase', NULL, NOW()),
(gen_random_uuid(), NULL, 'Freelance', 'INCOME', 'laptop', NULL, NOW()),
(gen_random_uuid(), NULL, 'Rendimentos', 'INCOME', 'trending-up', NULL, NOW()),
(gen_random_uuid(), NULL, 'Reembolsos', 'INCOME', 'refresh-ccw', NULL, NOW()),
(gen_random_uuid(), NULL, 'Outros', 'INCOME', 'more-horizontal', NULL, NOW()),

-- ======================
-- AMBOS
-- ======================
(gen_random_uuid(), NULL, 'Transferências', 'BOTH', 'repeat', NULL, NOW()),
(gen_random_uuid(), NULL, 'Ajustes', 'BOTH', 'sliders', NULL, NOW());