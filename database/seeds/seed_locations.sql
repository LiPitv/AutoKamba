UPDATE users SET
    latitude = -8.8383334, longitude = 13.2344444, endereco_base = 'Talatona, Luanda'
WHERE id IN (1, 3) AND latitude IS NULL;
UPDATE users SET
    latitude = -8.8211111, longitude = 13.2397222, endereco_base = 'Viana, Luanda'
WHERE id = 2 AND latitude IS NULL;
UPDATE users SET
    latitude = -8.8138889, longitude = 13.2308333, endereco_base = 'Maianga, Luanda'
WHERE id = 4 AND latitude IS NULL;
UPDATE users SET
    latitude = -8.8000000, longitude = 13.2858333, endereco_base = 'Cacuaco, Luanda'
WHERE id = 5 AND latitude IS NULL;
UPDATE users SET
    latitude = -8.9622222, longitude = 13.1463889, endereco_base = 'Kilamba, Luanda'
WHERE id = 6 AND latitude IS NULL;
UPDATE users SET
    latitude = -8.9166667, longitude = 13.1700000, endereco_base = 'Viana, Luanda'
WHERE id = 7 AND latitude IS NULL;
UPDATE users SET
    latitude = -8.8544444, longitude = 13.2511111, endereco_base = 'Benfica, Luanda'
WHERE id = 8 AND latitude IS NULL;
UPDATE users SET
    latitude = -8.9083333, longitude = 13.1844444, endereco_base = 'Benfica, Luanda'
WHERE id = 9 AND latitude IS NULL;
UPDATE users SET
    latitude = -8.8280556, longitude = 13.2430556, endereco_base = 'Samba, Luanda'
WHERE id = 10 AND latitude IS NULL;

INSERT IGNORE INTO locations (id, user_id, nome, endereco, latitude, longitude, referencia, principal) VALUES
    (1, 2, 'Casa',     'Talatona, Luanda',        -8.8383334, 13.2344444, 'Perto da rotunda do Talatona', 1),
    (2, 2, 'Trabalho', 'Ingombota, Luanda',       -8.8222222, 13.2300000, 'Edifício Atlântico, 3º andar', 0),
    (3, 8, 'Casa',     'Benfica, Luanda',         -8.8544444, 13.2511111, NULL, 1);