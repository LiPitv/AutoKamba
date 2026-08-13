-- Utilizadores de demonstração (password: admin123)
SET @hash = '$2y$10$Jr4ceFLvLO1u9/nfI9tS8eBQ0UOnGN4XcFKC7ZLpK8KkrkmqcDXYa';

INSERT IGNORE INTO users (id, role, nome, email, telefone, password_hash, disponivel) VALUES
    (1,  'admin',      'Administrador',          'admin@autokamba.co.ao',    '+244921000001', @hash, 1),
    (2,  'condutor',   'João Baptista',          'joao@autokamba.co.ao',     '+244921000002', @hash, 1),
    (3,  'prestador',  'Mecânica Kianda',        'kianda@autokamba.co.ao',   '+244921000003', @hash, 1),
    (4,  'prestador',  'Guinchos A Rápida',      'rapida@autokamba.co.ao',   '+244921000004', @hash, 1),
    (5,  'prestador',  'Pneus do Kikolo',        'kikolo@autokamba.co.ao',   '+244921000005', @hash, 1),
    (6,  'prestador',  'Baterias Kilamba',       'baterias@autokamba.co.ao', '+244921000006', @hash, 1),
    (7,  'prestador',  'EletriCar',               'eletricar@autokamba.co.ao','+244921000007', @hash, 0),
    (8,  'condutor',   'Maria dos Santos',       'maria@autokamba.co.ao',    '+244921000008', @hash, 1),
    (9,  'prestador',  'Chaveiro Luanda 24H',    'chaveiro@autokamba.co.ao', '+244921000009', @hash, 1),
    (10, 'prestador',  'Auto Reboques Samba',    'samba@autokamba.co.ao',    '+244921000010', @hash, 0);

UPDATE users SET password_hash = @hash WHERE id BETWEEN 1 AND 10;

INSERT IGNORE INTO vehicles (id, user_id, placa, marca, modelo, cor, ano, tipo, principal) VALUES
    (1, 2, 'LD-45-29-AB', 'Toyota',   'Corolla',  'Preto',  2018, 'carro', 1),
    (2, 8, 'LD-11-88-CD', 'Hyundai',  'Tucson',   'Branco', 2020, 'carro', 1),
    (3, 2, 'LD-72-14-EF', 'Kia',      'Picanto',  'Vermelho', 2021, 'carro', 0);