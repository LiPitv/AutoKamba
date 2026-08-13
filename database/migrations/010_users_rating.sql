ALTER TABLE users
    ADD COLUMN avaliacao_media DECIMAL(3, 2) NULL AFTER endereco_base,
    ADD COLUMN numero_avaliacoes INT UNSIGNED NOT NULL DEFAULT 0 AFTER avaliacao_media;