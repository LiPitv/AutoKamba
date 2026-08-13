# 🚗 AutoKamba

> **O teu parceiro na estrada.**

Plataforma de assistência automóvel que conecta condutores a mecânicos, técnicos automóveis, reboques e outros prestadores de serviços, com operação inicial em Luanda, Angola.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS 4, Vite, Leaflet, Chart.js, axios |
| Backend | PHP 8+, API REST (sem framework), PDO, JWT |
| Banco | MySQL 8+ |

## Estrutura

```
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/  layouts/  pages/  hooks/  services/
│       ├── contexts/  utils/  types/  assets/
├── backend/           # PHP API REST
│   ├── config/        # configurações globais (lê .env)
│   ├── public/        # front controller (php -S)
│   ├── routes/        # definição de rotas
│   ├── src/
│   │   ├── Core/      # Router, Request, Response, Database, Jwt, Env
│   │   ├── Controllers/  Models/  Services/  Middleware/  Helpers/
│   └── storage/logs/
├── database/
│   ├── migrations/    # SQL incremental (php migrate.php migrate)
│   ├── seeds/         # dados de demonstração
│   └── migrate.php    # CLI: migrate | rollback | seed | fresh
├── uploads/           # ficheiros enviados
├── docs/              # documentação da API
└── .env.example
```

## Requisitos

- PHP 8.1+ (para correr a API)
- MySQL 8+ (porta 3307 por predefinição)
- Node.js 18+

## Instalação

```bash
# 1. Banco de dados
mysql -h 127.0.0.1 -P 3307 -u autokamba -p < database/schema.sql   # criar base autokamba
php database/migrate.php migrate
php database/migrate.php seed

# 2. Backend (em backend/)
php -S localhost:8080 -t backend/public

# 3. Frontend (em frontend/)
npm install
npm run dev        # http://localhost:5173 (proxy /api e /uploads -> :8080)
```

Crie um ficheiro `.env` na raiz a partir de `.env.example` para personalizar.

## Utilizadores de demonstração

| Papel | Email | Pass |
|---|---|---|
| Administrador | `admin@autokamba.co.ao` | `admin123` |
| Condutor | `joao@...` (ver seeds) | — |
| Prestador | (ver seeds) | — |

As credenciais exatas estão definidas em `database/seeds/`.

## API

Documentação em [docs/api.md](docs/api.md). Prefixo: `/api`. Autenticação: `Authorization: Bearer <jwt>`.

## Testes

```bash
php backend/tests/smoke.php   # fluxo completo e2e: login -> pedido -> serviço -> pagamento -> avaliação -> admin (35 cenários)
```

O servidor PHP deve estar a correr em `127.0.0.1:8080` durante o teste. Termina com `exit 0` se todos os cenários passarem.

## Estado do desenvolvimento (etapas)

- [x] ETAPA 1 — Configuração do projeto (estrutura, env, health check, build validado)
- [x] ETAPA 2 — Banco de dados (tabelas em falta, estados do spec, seeds)
- [x] ETAPA 3 — Autenticação (registro condutor/profissional, login, perfil)
- [x] ETAPA 4 — Landing page completa
- [x] ETAPA 5 — Dashboard do condutor
- [x] ETAPA 6 — Pedidos e serviços
- [x] ETAPA 7 — Dashboard profissional
- [x] ETAPA 8 — Localização e mapas
- [x] ETAPA 9 — Avaliações e histórico
- [x] ETAPA 10 — Dashboard administrativo
- [x] ETAPA 11 — Notificações e chat
- [x] ETAPA 12 — Pagamentos e comissões
- [x] ETAPA 13 — Segurança
- [x] ETAPA 14 — Testes
- [x] ETAPA 15 — Otimização e documentação

## Regras de desenvolvimento

- Nunca guardar passwords em texto simples (`password_hash` / `password_verify`).
- Prepared statements PDO em todas as queries.
- Nunca colocar chaves ou passwords reais no Git (usar `.env`).
- Nenhum número estático nos dashboards — tudo vem do MySQL via API.
- Estados de pedido e profissional conforme spec (ver `docs/api.md`).