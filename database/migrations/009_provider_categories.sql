CREATE TABLE IF NOT EXISTS provider_categories (
    provider_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (provider_id, category_id),
    CONSTRAINT fk_pc_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO provider_categories (provider_id, category_id) VALUES
    (3, 5), (3, 6), (3, 2),
    (4, 4),
    (5, 1), (5, 2);