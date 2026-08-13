# AutoKamba — API

Prefixo base: `/api`
Formato: JSON (`{ "error": true, "message": "..." }` em erros)
Autenticação: `Authorization: Bearer <jwt>`

## Estados dos pedidos

| Estado | Significado |
|---|---|
| `pendente` | Pedido criado, a procurar profissional |
| `aceite` | Profissional aceitou |
| `em_atendimento` | Serviço em andamento |
| `concluido` | Serviço concluído |
| `cancelado` | Cancelado |

(*A etiqueta exata do spec — searching/on_the_way/arrived/in_progress/rejected — é aplicada na ETAPA 2.*)

## Endpoints planeados

### Autenticação (ETAPA 3)
```
POST /api/auth/register          # condutor ou profissional
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Utilizador e veículos (ETAPA 5)
```
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/vehicles
POST   /api/vehicles
PUT    /api/vehicles/{id}
DELETE /api/vehicles/{id}
```

### Serviços e categorias (ETAPA 4/6)
```
GET /api/services
GET /api/service-categories
```

### Pedidos (ETAPA 6)
```
POST /api/requests
GET  /api/requests
GET  /api/requests/{id}
PUT  /api/requests/{id}/status
```

### Profissionais (ETAPA 6)
```
GET /api/professionals/nearby
GET /api/professionals/{id}
```

### Avaliações, notificações, chat (ETAPA 9/11)
```
POST /api/ratings
GET  /api/notifications
PUT  /api/notifications/{id}/read
GET  /api/messages
POST /api/messages
```

### Administração (ETAPA 10)
```
GET /api/admin/stats
GET /api/admin/professionals
PUT /api/admin/professionals/{id}/verification
GET /api/admin/drivers
GET /api/admin/complaints
...
```