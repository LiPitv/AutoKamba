CREATE TABLE IF NOT EXISTS service_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(40) NOT NULL UNIQUE,
    nome VARCHAR(80) NOT NULL,
    icone VARCHAR(40) NOT NULL DEFAULT 'wrench',
    descricao VARCHAR(255) NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO service_categories (slug, nome, icone, descricao) VALUES
    ('pneu',        'Pneu furado',            'circle-dot',  'Troca ou reparação de pneus'),
    ('bateria',     'Bateria descarregada',   'zap',         'Chupeta ou substituição de bateria'),
    ('combustivel', 'Ficou sem combustível',  'fuel',        'Entrega de combustível no local'),
    ('guincho',     'Guincho / reboque',      'truck',       'Reboque do veículo'),
    ('mecanico',    'Avaria mecânica',        'wrench',      'Problemas mecânicos gerais'),
    ('eletrico',    'Avaria elétrica',        'plug',        'Problemas elétricos do veículo'),
    ('fechadura',   'Trancado do lado de fora','key-round',  'Abertura de portas'),
    ('outro',       'Outro problema',         'help-circle', 'Outro tipo de ajuda');