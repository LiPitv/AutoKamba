CREATE TABLE IF NOT EXISTS services (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    provider_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    nome VARCHAR(120) NOT NULL,
    preco DECIMAL(12, 2) NOT NULL DEFAULT 0,
    descricao VARCHAR(255) NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_services_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    INDEX idx_services_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS professional_documents (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    professional_id INT UNSIGNED NOT NULL,
    tipo ENUM('bi', 'carta_conducao', 'profissional', 'viatura') NOT NULL,
    caminho VARCHAR(255) NOT NULL,
    estado ENUM('pendente', 'verificado', 'rejeitado') NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pdocs_professional FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_pdocs_professional (professional_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS request_status_history (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_id INT UNSIGNED NOT NULL,
    status VARCHAR(30) NOT NULL,
    observacao VARCHAR(255) NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rsh_request FOREIGN KEY (request_id) REFERENCES sos_requests(id) ON DELETE CASCADE,
    INDEX idx_rsh_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS locations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    nome VARCHAR(80) NOT NULL,
    endereco VARCHAR(255) NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    referencia VARCHAR(255) NULL,
    principal TINYINT(1) NOT NULL DEFAULT 0,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_locations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_locations_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    provider_id INT UNSIGNED NOT NULL,
    metodo ENUM('dinheiro', 'cartao', 'transferencia', 'carteira') NULL,
    valor DECIMAL(12, 2) NOT NULL,
    comissao DECIMAL(12, 2) NOT NULL DEFAULT 0,
    valor_liquido DECIMAL(12, 2) NOT NULL DEFAULT 0,
    estado ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_request FOREIGN KEY (request_id) REFERENCES sos_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_payments_request (request_id),
    INDEX idx_payments_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS commissions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_id INT UNSIGNED NOT NULL,
    provider_id INT UNSIGNED NOT NULL,
    percentual DECIMAL(5, 2) NOT NULL,
    valor DECIMAL(12, 2) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commissions_request FOREIGN KEY (request_id) REFERENCES sos_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_commissions_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_commissions_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    mensagem VARCHAR(500) NOT NULL,
    tipo VARCHAR(40) NOT NULL DEFAULT 'info',
    link VARCHAR(255) NULL,
    lida TINYINT(1) NOT NULL DEFAULT 0,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_lida (user_id, lida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_id INT UNSIGNED NOT NULL,
    remetente_id INT UNSIGNED NOT NULL,
    destinatario_id INT UNSIGNED NOT NULL,
    mensagem VARCHAR(1000) NOT NULL,
    anexo VARCHAR(255) NULL,
    lida TINYINT(1) NOT NULL DEFAULT 0,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_request FOREIGN KEY (request_id) REFERENCES sos_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (remetente_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_recipient FOREIGN KEY (destinatario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_request (request_id, criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorites (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    provider_id INT UNSIGNED NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_favorites (user_id, provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS complaints (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    request_id INT UNSIGNED NULL,
    categoria VARCHAR(60) NOT NULL,
    descricao VARCHAR(1000) NOT NULL,
    evidencias VARCHAR(255) NULL,
    estado ENUM('aberto', 'em_analise', 'resolvido', 'encerrado') NOT NULL DEFAULT 'aberto',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaints_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_complaints_request FOREIGN KEY (request_id) REFERENCES sos_requests(id) ON DELETE SET NULL,
    INDEX idx_complaints_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS promotions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    descricao VARCHAR(500) NULL,
    codigo VARCHAR(40) NULL,
    percentual DECIMAL(5, 2) NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    inicio_em TIMESTAMP NULL,
    fim_em TIMESTAMP NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id INT UNSIGNED NULL,
    acao VARCHAR(120) NOT NULL,
    detalhes VARCHAR(500) NULL,
    ip VARCHAR(45) NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_logs_admin (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
    chave VARCHAR(60) PRIMARY KEY,
    valor VARCHAR(255) NOT NULL,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO settings (chave, valor) VALUES
    ('commission_rate', '10'),
    ('platform_name', 'AutoKamba'),
    ('support_phone', '+244923000000');