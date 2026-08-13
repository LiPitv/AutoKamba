ALTER TABLE sos_requests
    MODIFY COLUMN status ENUM(
        'pendente', 'procurando', 'aceite', 'a_caminho', 'chegou',
        'em_atendimento', 'concluido', 'cancelado', 'rejeitado'
    ) NOT NULL DEFAULT 'procurando',
    ADD COLUMN provider_id INT UNSIGNED NULL AFTER category_id,
    ADD COLUMN referencia VARCHAR(255) NULL AFTER endereco,
    ADD COLUMN valor DECIMAL(12, 2) NULL AFTER referencia,
    ADD COLUMN metodo_pagamento ENUM('dinheiro', 'cartao', 'transferencia', 'carteira') NULL AFTER valor,
    ADD COLUMN estado_pagamento ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente' AFTER metodo_pagamento;

ALTER TABLE sos_requests
    ADD CONSTRAINT fk_requests_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE SET NULL,
    ADD INDEX idx_requests_provider (provider_id);

ALTER TABLE reviews
    ADD COLUMN rapidez TINYINT UNSIGNED NULL AFTER nota,
    ADD COLUMN atendimento TINYINT UNSIGNED NULL AFTER rapidez,
    ADD COLUMN qualidade TINYINT UNSIGNED NULL AFTER atendimento,
    ADD COLUMN preco TINYINT UNSIGNED NULL AFTER qualidade;