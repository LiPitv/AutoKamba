CREATE TABLE IF NOT EXISTS sos_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero_req VARCHAR(20) NOT NULL UNIQUE,
    user_id INT UNSIGNED NOT NULL,
    vehicle_id INT UNSIGNED NULL,
    category_id INT UNSIGNED NULL,
    descricao VARCHAR(500) NULL,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    endereco VARCHAR(255) NULL,
    status ENUM('pendente', 'aceite', 'em_atendimento', 'concluido', 'cancelado')
        NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_requests_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    CONSTRAINT fk_requests_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL,
    INDEX idx_requests_status (status),
    INDEX idx_requests_user (user_id),
    INDEX idx_requests_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;