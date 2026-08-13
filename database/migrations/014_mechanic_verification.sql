ALTER TABLE users
    MODIFY COLUMN estado_profissional ENUM(
        'pendente_verificacao', 'submetido_verificacao', 'verificado', 'online',
        'offline', 'ocupado', 'suspenso', 'bloqueado', 'rejeitado'
    ) NULL,
    ADD COLUMN motivo_rejeicao VARCHAR(255) NULL AFTER estado_profissional,
    ADD COLUMN submetido_verificacao TINYINT(1) NOT NULL DEFAULT 0 AFTER motivo_rejeicao,
    ADD COLUMN verificado_por INT UNSIGNED NULL AFTER submetido_verificacao,
    ADD COLUMN verificado_em TIMESTAMP NULL AFTER verificado_por;

ALTER TABLE professional_documents
    ADD COLUMN motivo_rejeicao VARCHAR(255) NULL AFTER estado,
    ADD COLUMN verificado_por INT UNSIGNED NULL AFTER motivo_rejeicao,
    ADD COLUMN verificado_em TIMESTAMP NULL AFTER verificado_por;