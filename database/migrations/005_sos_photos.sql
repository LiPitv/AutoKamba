CREATE TABLE IF NOT EXISTS sos_photos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_id INT UNSIGNED NOT NULL,
    caminho VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_photos_request FOREIGN KEY (request_id) REFERENCES sos_requests(id) ON DELETE CASCADE,
    INDEX idx_photos_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;