CREATE TABLE IF NOT EXISTS reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    provider_id INT UNSIGNED NOT NULL,
    nota TINYINT UNSIGNED NOT NULL,
    comentario VARCHAR(500) NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_request FOREIGN KEY (request_id) REFERENCES sos_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_reviews_nota CHECK (nota BETWEEN 1 AND 5),
    UNIQUE KEY uq_reviews_request (request_id),
    INDEX idx_reviews_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;