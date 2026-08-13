-- Pedidos, pagamentos, avaliações, notificações, chat e restantes dados de demonstração
INSERT IGNORE INTO sos_requests (id, numero_req, user_id, vehicle_id, category_id, provider_id, descricao, latitude, longitude, endereco, referencia, valor, metodo_pagamento, estado_pagamento, status) VALUES
    (1, 'AK-20260810-0001', 2, 1, 5, NULL,
     'O carro não pega, faz um barulho estranho ao ligar a ignição.',
     -8.8383334, 13.2344444, 'Talatona, Luanda', 'Rotunda do Talatona', NULL, NULL, 'pendente', 'procurando'),
    (2, 'AK-20260810-0002', 2, 1, 2, 6,
     'Bateria descarregada depois de ficar parado.', 
     -8.8211111, 13.2397222, 'Viana, Luanda', 'Parque ao lado do mercado', 7500.00, NULL, 'pendente', 'em_atendimento'),
    (3, 'AK-20260809-0003', 2, 1, 5, 3,
     'Travões a chiarem, revisão completa.',
     -8.8383334, 13.2344444, 'Talatona, Luanda', NULL, 25000.00, 'dinheiro', 'pago', 'concluido'),
    (4, 'AK-20260730-0004', 8, 2, 4, NULL,
     'Preciso de reboque, o carro não passa da 2ª velocidade.',
     -8.8544444, 13.2511111, 'Benfica, Luanda', NULL, NULL, NULL, 'pendente', 'cancelado'),
    (5, 'AK-20260728-0005', 8, 2, 1, 5,
     'Pneu da frente esquerdo furado na rotunda.',
     -8.8544444, 13.2511111, 'Benfica, Luanda', NULL, 8000.00, 'carteira', 'pago', 'concluido');

INSERT IGNORE INTO request_status_history (id, request_id, status, observacao, criado_em) VALUES
    (1,  1, 'procurando', 'Pedido criado', '2026-08-10 18:30:00'),
    (2,  2, 'procurando', 'Pedido criado', '2026-08-10 19:00:00'),
    (3,  2, 'aceite',     'Profissional aceitou', '2026-08-10 19:02:00'),
    (4,  2, 'a_caminho',  'Profissional a caminho', '2026-08-10 19:05:00'),
    (5,  2, 'chegou',     'Profissional chegou ao local', '2026-08-10 19:20:00'),
    (6,  2, 'em_atendimento', 'Serviço iniciado', '2026-08-10 19:22:00'),
    (7,  3, 'procurando', 'Pedido criado', '2026-08-09 10:00:00'),
    (8,  3, 'aceite',     'Profissional aceitou', '2026-08-09 10:05:00'),
    (9,  3, 'a_caminho',  'Profissional a caminho', '2026-08-09 10:10:00'),
    (10, 3, 'chegou',     'Profissional chegou ao local', '2026-08-09 10:25:00'),
    (11, 3, 'em_atendimento', 'Serviço iniciado', '2026-08-09 10:30:00'),
    (12, 3, 'concluido',  'Serviço concluído', '2026-08-09 12:10:00'),
    (13, 4, 'procurando', 'Pedido criado', '2026-07-30 09:00:00'),
    (14, 4, 'cancelado',  'Cancelado pelo condutor', '2026-07-30 10:00:00'),
    (15, 5, 'procurando', 'Pedido criado', '2026-07-28 15:00:00'),
    (16, 5, 'aceite',     'Profissional aceitou', '2026-07-28 15:03:00'),
    (17, 5, 'concluido',  'Serviço concluído', '2026-07-28 15:40:00');

INSERT IGNORE INTO payments (id, request_id, user_id, provider_id, metodo, valor, comissao, valor_liquido, estado) VALUES
    (1, 3, 2, 3, 'dinheiro', 25000.00, 2500.00, 22500.00, 'pago'),
    (2, 5, 8, 5, 'carteira', 8000.00, 800.00, 7200.00, 'pago');

INSERT IGNORE INTO commissions (id, request_id, provider_id, percentual, valor) VALUES
    (1, 3, 3, 10.00, 2500.00),
    (2, 5, 5, 10.00, 800.00);

INSERT IGNORE INTO reviews (id, request_id, user_id, provider_id, nota, rapidez, atendimento, qualidade, preco, comentario, criado_em) VALUES
    (1, 3, 2, 3, 5, 5, 5, 4, 4, 'Serviço muito profissional, chegou rápido e resolveu os travões.', '2026-08-09 13:00:00'),
    (2, 5, 8, 5, 5, 5, 5, 5, 5, 'Troca de pneu rápida e com simpatia. Recomendo.', '2026-07-28 16:00:00');

UPDATE users u SET
    avaliacao_media = (SELECT ROUND(AVG(r.nota), 2) FROM reviews r WHERE r.provider_id = u.id),
    numero_avaliacoes = (SELECT COUNT(*) FROM reviews r WHERE r.provider_id = u.id)
WHERE u.role = 'prestador';

INSERT IGNORE INTO notifications (id, user_id, titulo, mensagem, tipo, link, lida, criado_em) VALUES
    (1, 3, 'Novo pedido próximo', 'Maria dos Santos precisa de reboque perto de si.', 'pedido', '/app/pedidos-disponiveis', 0, '2026-07-30 09:00:00'),
    (2, 2, 'Serviço concluído', 'O serviço AK-20260809-0003 foi concluído. Avalie o profissional.', 'concluido', '/app/pedidos/3', 1, '2026-08-09 12:10:00'),
    (3, 6, 'Pedido aceite', 'Aceitou o pedido AK-20260810-0002. Está a caminho.', 'pedido', '/app/servico-atual', 0, '2026-08-10 19:02:00'),
    (4, 2, 'Profissional a caminho', 'Baterias Kilamba está a caminho do seu pedido.', 'rastreio', '/app/pedidos/2', 0, '2026-08-10 19:05:00'),
    (5, 8, 'Conta verificada', 'A sua conta foi ativada com sucesso.', 'conta', '/app/dashboard', 1, '2026-07-01 10:00:00');

INSERT IGNORE INTO messages (id, request_id, remetente_id, destinatario_id, mensagem, lida, criado_em) VALUES
    (1, 2, 2, 6, 'Estou no parque ao lado do mercado, com um carro preto.', 1, '2026-08-10 19:03:00'),
    (2, 2, 6, 2, 'Já estou a chegar, 5 minutos.', 1, '2026-08-10 19:04:00');

INSERT IGNORE INTO favorites (id, user_id, provider_id) VALUES
    (1, 2, 3),
    (2, 2, 6),
    (3, 8, 5);

INSERT IGNORE INTO complaints (id, user_id, request_id, categoria, descricao, evidencias, estado, criado_em) VALUES
    (1, 8, 4, 'serviço', 'O reboque combinado nunca apareceu e não atendeu o telefone.', NULL, 'aberto', '2026-07-30 12:00:00');

INSERT IGNORE INTO promotions (id, titulo, descricao, codigo, percentual, ativo, inicio_em, fim_em) VALUES
    (1, 'Desconto no guincho', '10% de desconto em serviços de guincho este mês.', 'GUINCHO10', 10.00, 1, '2026-08-01 00:00:00', '2026-08-31 23:59:59'),
    (2, 'Bem-vindo ao AutoKamba', '5% na primeira assistência para novos condutores.', 'BEMVINDO5', 5.00, 1, NULL, NULL);

INSERT IGNORE INTO admin_logs (id, admin_id, acao, detalhes, ip) VALUES
    (1, 1, 'sistema', 'Base de dados inicializada com dados de demonstração.', '127.0.0.1');