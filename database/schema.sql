CREATE DATABASE IF NOT EXISTS autokamba CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autokamba;

CREATE TABLE `admin_logs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` int unsigned DEFAULT NULL,
  `acao` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detalhes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_logs_admin` (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `commissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int unsigned NOT NULL,
  `provider_id` int unsigned NOT NULL,
  `percentual` decimal(5,2) NOT NULL,
  `valor` decimal(12,2) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_commissions_request` (`request_id`),
  KEY `idx_commissions_provider` (`provider_id`),
  CONSTRAINT `fk_commissions_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_commissions_request` FOREIGN KEY (`request_id`) REFERENCES `sos_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `complaints` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `request_id` int unsigned DEFAULT NULL,
  `categoria` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `evidencias` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('aberto','em_analise','resolvido','encerrado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'aberto',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_complaints_user` (`user_id`),
  KEY `fk_complaints_request` (`request_id`),
  KEY `idx_complaints_estado` (`estado`),
  CONSTRAINT `fk_complaints_request` FOREIGN KEY (`request_id`) REFERENCES `sos_requests` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_complaints_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `favorites` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `provider_id` int unsigned NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favorites` (`user_id`,`provider_id`),
  KEY `fk_favorites_provider` (`provider_id`),
  CONSTRAINT `fk_favorites_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `locations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `nome` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endereco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `referencia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal` tinyint(1) NOT NULL DEFAULT '0',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_locations_user` (`user_id`),
  CONSTRAINT `fk_locations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int unsigned NOT NULL,
  `remetente_id` int unsigned NOT NULL,
  `destinatario_id` int unsigned NOT NULL,
  `mensagem` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anexo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT '0',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_messages_sender` (`remetente_id`),
  KEY `fk_messages_recipient` (`destinatario_id`),
  KEY `idx_messages_request` (`request_id`,`criado_em`),
  CONSTRAINT `fk_messages_recipient` FOREIGN KEY (`destinatario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_messages_request` FOREIGN KEY (`request_id`) REFERENCES `sos_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_messages_sender` FOREIGN KEY (`remetente_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `titulo` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensagem` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info',
  `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT '0',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  KEY `idx_notifications_lida` (`user_id`,`lida`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `provider_id` int unsigned NOT NULL,
  `metodo` enum('dinheiro','cartao','transferencia','carteira') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor` decimal(12,2) NOT NULL,
  `comissao` decimal(12,2) NOT NULL DEFAULT '0.00',
  `valor_liquido` decimal(12,2) NOT NULL DEFAULT '0.00',
  `estado` enum('pendente','pago') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payments_request` (`request_id`),
  KEY `fk_payments_user` (`user_id`),
  KEY `idx_payments_provider` (`provider_id`),
  CONSTRAINT `fk_payments_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payments_request` FOREIGN KEY (`request_id`) REFERENCES `sos_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `professional_documents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `professional_id` int unsigned NOT NULL,
  `tipo` enum('bi','carta_conducao','profissional','viatura') COLLATE utf8mb4_unicode_ci NOT NULL,
  `caminho` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('pendente','verificado','rejeitado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pdocs_professional` (`professional_id`),
  CONSTRAINT `fk_pdocs_professional` FOREIGN KEY (`professional_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `promotions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `percentual` decimal(5,2) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `inicio_em` timestamp NULL DEFAULT NULL,
  `fim_em` timestamp NULL DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `proposals` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int unsigned NOT NULL,
  `provider_id` int unsigned NOT NULL,
  `valor` decimal(12,2) DEFAULT NULL,
  `mensagem` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pendente','aceite','recusada','retirada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_proposal_request_provider` (`request_id`,`provider_id`),
  KEY `idx_proposals_provider` (`provider_id`),
  KEY `idx_proposals_status` (`status`),
  CONSTRAINT `fk_proposals_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_proposals_request` FOREIGN KEY (`request_id`) REFERENCES `sos_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `provider_categories` (
  `provider_id` int unsigned NOT NULL,
  `category_id` int unsigned NOT NULL,
  PRIMARY KEY (`provider_id`,`category_id`),
  KEY `fk_pc_category` (`category_id`),
  CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `request_status_history` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int unsigned NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rsh_request` (`request_id`),
  CONSTRAINT `fk_rsh_request` FOREIGN KEY (`request_id`) REFERENCES `sos_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `provider_id` int unsigned NOT NULL,
  `nota` tinyint unsigned NOT NULL,
  `rapidez` tinyint unsigned DEFAULT NULL,
  `atendimento` tinyint unsigned DEFAULT NULL,
  `qualidade` tinyint unsigned DEFAULT NULL,
  `preco` tinyint unsigned DEFAULT NULL,
  `comentario` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reviews_request` (`request_id`),
  KEY `fk_reviews_user` (`user_id`),
  KEY `idx_reviews_provider` (`provider_id`),
  CONSTRAINT `fk_reviews_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_request` FOREIGN KEY (`request_id`) REFERENCES `sos_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_reviews_nota` CHECK ((`nota` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `schema_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `executado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `service_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icone` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wrench',
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `services` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `provider_id` int unsigned NOT NULL,
  `category_id` int unsigned NOT NULL,
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preco` decimal(12,2) NOT NULL DEFAULT '0.00',
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_services_category` (`category_id`),
  KEY `idx_services_provider` (`provider_id`),
  CONSTRAINT `fk_services_category` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_services_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `settings` (
  `chave` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `atualizado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`chave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sos_photos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int unsigned NOT NULL,
  `caminho` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_photos_request` (`request_id`),
  CONSTRAINT `fk_photos_request` FOREIGN KEY (`request_id`) REFERENCES `sos_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sos_requests` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `numero_req` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned NOT NULL,
  `vehicle_id` int unsigned DEFAULT NULL,
  `category_id` int unsigned DEFAULT NULL,
  `provider_id` int unsigned DEFAULT NULL,
  `descricao` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `endereco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referencia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor` decimal(12,2) DEFAULT NULL,
  `metodo_pagamento` enum('dinheiro','cartao','transferencia','carteira') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_pagamento` enum('pendente','pago') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  `status` enum('pendente','procurando','aceite','a_caminho','chegou','em_atendimento','concluido','cancelado','rejeitado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'procurando',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_req` (`numero_req`),
  KEY `fk_requests_vehicle` (`vehicle_id`),
  KEY `fk_requests_category` (`category_id`),
  KEY `idx_requests_status` (`status`),
  KEY `idx_requests_user` (`user_id`),
  KEY `idx_requests_location` (`latitude`,`longitude`),
  KEY `idx_requests_provider` (`provider_id`),
  CONSTRAINT `fk_requests_category` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_requests_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_requests_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role` enum('condutor','prestador','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'condutor',
  `tipo_profissional` enum('mecanico','tecnico','eletricista','reboque','chaveiro','pneus','bateria','combustivel','outro') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especialidade` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experiencia` int unsigned DEFAULT NULL,
  `area_atendimento` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preco_base` decimal(12,2) DEFAULT NULL,
  `descricao` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_profissional` enum('pendente_verificacao','verificado','online','offline','ocupado','suspenso','bloqueado') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('ativo','suspenso','bloqueado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ativo',
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `endereco_base` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avaliacao_media` decimal(3,2) DEFAULT NULL,
  `numero_avaliacoes` int unsigned NOT NULL DEFAULT '0',
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disponivel` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telefone` (`telefone`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `vehicles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `placa` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marca` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cor` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` enum('carro','motocicleta','caminhao','outro') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal` tinyint(1) NOT NULL DEFAULT '0',
  `ano` smallint unsigned DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `placa` (`placa`),
  KEY `idx_vehicles_user` (`user_id`),
  CONSTRAINT `fk_vehicles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

