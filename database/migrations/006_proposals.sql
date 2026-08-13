CREATE TABLE IF NOT EXISTS proposals (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_id INT UNSIGNED NOT NULL,
    provider_id INT UNSIGNED NOT NULL,
    valor DECIMAL(12, 2) NULL,
    mensagem VARCHAR(500) NULL,
    status ENUM('pendente', 'aceite', 'recusada', 'retirada') NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_proposals_request FOREIGN KEY (request_id) REFERENCES sos_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_proposals_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_proposal_request_provider (request_id, provider_id),
    INDEX idx_proposals_provider (provider_id),
    INDEX idx_proposals_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;