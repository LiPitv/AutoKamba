ALTER TABLE users
    ADD COLUMN tipo_profissional ENUM('mecanico', 'tecnico', 'eletricista', 'reboque', 'chaveiro', 'pneus', 'bateria', 'combustivel', 'outro') NULL AFTER role,
    ADD COLUMN especialidade VARCHAR(120) NULL AFTER tipo_profissional,
    ADD COLUMN experiencia INT UNSIGNED NULL AFTER especialidade,
    ADD COLUMN area_atendimento VARCHAR(120) NULL AFTER experiencia,
    ADD COLUMN preco_base DECIMAL(12, 2) NULL AFTER area_atendimento,
    ADD COLUMN descricao VARCHAR(500) NULL AFTER preco_base,
    ADD COLUMN estado_profissional ENUM('pendente_verificacao', 'verificado', 'online', 'offline', 'ocupado', 'suspenso', 'bloqueado') NULL AFTER descricao,
    ADD COLUMN estado ENUM('ativo', 'suspenso', 'bloqueado') NOT NULL DEFAULT 'ativo' AFTER estado_profissional;

ALTER TABLE vehicles
    ADD COLUMN tipo ENUM('carro', 'motocicleta', 'caminhao', 'outro') NULL AFTER cor,
    ADD COLUMN foto VARCHAR(255) NULL AFTER tipo,
    ADD COLUMN principal TINYINT(1) NOT NULL DEFAULT 0 AFTER foto;

INSERT IGNORE INTO service_categories (slug, nome, icone, descricao) VALUES
    ('acidente',      'Acidente',              'car-crash',     'Assistência após acidente'),
    ('chaveiro',      'Chaveiro automóvel',    'key-round',     'Chaves perdidas ou avariadas'),
    ('eletricidade',  'Eletricidade automóvel','plug',          'Problemas elétricos do veículo'),
    ('oleo',          'Troca de óleo',         'droplet',       'Troca de óleo e filtros'),
    ('travoes',       'Travões',               'shield',        'Reparação de travões'),
    ('suspensao',     'Suspensão',             'fuel',          'Reparação de suspensão'),
    ('diagnostico',   'Diagnóstico',           'stethoscope',   'Diagnóstico eletrónico do veículo');