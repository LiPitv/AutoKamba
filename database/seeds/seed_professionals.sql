-- Dados profissionais e ofertas de serviços de demonstração
UPDATE users SET
    tipo_profissional = 'mecanico',   especialidade = 'Motores, travões e suspensão', experiencia = 12,
    area_atendimento = 'Talatona, Benfica, Kilamba', preco_base = 8000.00,
    descricao = 'Mecânica geral com 12 anos de experiência. Assistência 24 horas na zona sul de Luanda.',
    estado_profissional = 'online',   estado = 'ativo'
WHERE id = 3;
UPDATE users SET
    tipo_profissional = 'reboque',    especialidade = 'Guincho e reboque pesado', experiencia = 8,
    area_atendimento = 'Toda a cidade de Luanda', preco_base = 15000.00,
    descricao = 'Serviço de guincho rápido para toda a Luanda, com viatura de reboque equipada.',
    estado_profissional = 'online',   estado = 'ativo'
WHERE id = 4;
UPDATE users SET
    tipo_profissional = 'pneus',      especialidade = 'Troca e reparação de pneus', experiencia = 6,
    area_atendimento = 'Cacuaco, Viana, Talatona', preco_base = 5000.00,
    descricao = 'Troca de pneus na estrada, com pneus novos disponíveis.',
    estado_profissional = 'online',   estado = 'ativo'
WHERE id = 5;
UPDATE users SET
    tipo_profissional = 'bateria',    especialidade = 'Baterias e sistema elétrico', experiencia = 5,
    area_atendimento = 'Kilamba, Benfica, Talatona', preco_base = 7000.00,
    descricao = 'Entrega e instalação de baterias novas, chupeta de emergência.',
    estado_profissional = 'online',   estado = 'ativo'
WHERE id = 6;
UPDATE users SET
    tipo_profissional = 'eletricista',especialidade = 'Diagnóstico eletrónico automóvel', experiencia = 4,
    area_atendimento = 'Viana, Cacuaco', preco_base = 10000.00,
    descricao = 'Especialista em diagnóstico eletrónico e avarias elétricas.',
    estado_profissional = 'pendente_verificacao', estado = 'ativo'
WHERE id = 7;
UPDATE users SET
    tipo_profissional = 'chaveiro',   especialidade = 'Chaves automóveis, abertura de portas', experiencia = 10,
    area_atendimento = 'Benfica, Ingombota, Talatona', preco_base = 8000.00,
    descricao = 'Chaveiro automóvel 24 horas. Abertura de portas sem danos.',
    estado_profissional = 'online',   estado = 'ativo'
WHERE id = 9;
UPDATE users SET
    tipo_profissional = 'reboque',    especialidade = 'Reboque de viaturas', experiencia = 3,
    area_atendimento = 'Samba, Maianga', preco_base = 12000.00,
    descricao = '',
    estado_profissional = 'suspenso', estado = 'ativo'
WHERE id = 10;

INSERT IGNORE INTO provider_categories (provider_id, category_id) VALUES
    (3, 5), (3, 12), (3, 13), (3, 15), (3, 14),
    (4, 4),
    (5, 1),
    (6, 2),
    (7, 11), (7, 15),
    (9, 10),
    (10, 4);

INSERT IGNORE INTO services (id, provider_id, category_id, nome, preco, descricao, ativo) VALUES
    (1,  3, 5,  'Avaria mecânica no local',   8000.00,  'Diagnóstico e reparação rápida no local', 1),
    (2,  3, 12, 'Troca de óleo e filtros',    12000.00, 'Óleo sintético incluído', 1),
    (3,  3, 13, 'Substituição de travões',    18000.00, 'Pastilhas e discos', 1),
    (4,  3, 14, 'Suspensão — amortecedores',  25000.00, 'Por jogo de amortecedores', 1),
    (5,  3, 15, 'Diagnóstico eletrónico',     8000.00,  'Leitura de avarias com scanner', 1),
    (6,  4, 4,  'Reboque dentro de Luanda',   20000.00, 'Até 20 km, carga incluída', 1),
    (7,  5, 1,  'Troca de pneu na estrada',   8000.00,  'Com pneu suplente', 1),
    (8,  5, 1,  'Reparação de pneu furado',   6000.00,  'Vulcanização no local', 1),
    (9,  6, 2,  'Bateria nova + instalação',  15000.00, 'Garantia de 6 meses', 1),
    (10, 6, 2,  'Chupeta de emergência',      5000.00,  'Partida assistida', 1),
    (11, 9, 10, 'Abertura de portas',         10000.00, 'Sem danos na viatura', 1),
    (12, 9, 10, 'Cópia de chave codificada',  25000.00, 'Chave com transponder', 1);

INSERT IGNORE INTO professional_documents (id, professional_id, tipo, caminho, estado) VALUES
    (1, 3, 'bi', '/uploads/demo/bi_kianda.pdf', 'verificado'),
    (2, 3, 'carta_conducao', '/uploads/demo/carta_kianda.pdf', 'verificado'),
    (3, 3, 'profissional', '/uploads/demo/alvará_kianda.pdf', 'verificado'),
    (4, 6, 'bi', '/uploads/demo/bi_baterias.pdf', 'pendente'),
    (5, 6, 'carta_conducao', '/uploads/demo/carta_baterias.pdf', 'pendente'),
    (6, 7, 'bi', '/uploads/demo/bi_eletricar.pdf', 'pendente');