ALTER TABLE users
    ADD COLUMN latitude DECIMAL(10, 7) NULL AFTER telefone,
    ADD COLUMN longitude DECIMAL(10, 7) NULL AFTER latitude,
    ADD COLUMN endereco_base VARCHAR(255) NULL AFTER longitude;