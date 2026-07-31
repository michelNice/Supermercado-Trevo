<img width="1132" height="526" alt="Design sem nome (1)" src="https://github.com/user-attachments/assets/33a387d5-ecc1-4329-9c34-59bea1b7f150" />

# Trevo Supermercado

Aplicação web de e-commerce para o **Trevo Supermercado**, com catálogo de produtos, carrinho de compras, checkout completo e integração com pagamentos via Mercado Pago (cartão e PIX).

## Tecnologias utilizadas

### Frontend
| Tecnologia | Uso |
|---|---|
| [React 19](https://react.dev/) | Interface e componentes |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite 7](https://vite.dev/) | Build tool e dev server |
| [React Router DOM 7](https://reactrouter.com/) | Navegação entre páginas |
| [Sass](https://sass-lang.com/) | Estilização dos componentes |
| [Supabase](https://supabase.com/) | Catálogo de produtos (client-side) |
| [Mercado Pago SDK React](https://www.mercadopago.com.br/developers) | Checkout com cartão |
| [Swiper](https://swiperjs.com/) | Carrosséis (hero, produtos) |
| [Leaflet / React Leaflet](https://react-leaflet.js.org/) | Mapa no formulário de endereço |
| [Lucide React](https://lucide.dev/) / [React Icons](https://react-icons.github.io/react-icons/) | Ícones |
| [React Google reCAPTCHA](https://www.npmjs.com/package/react-google-recaptcha) | Proteção no login |

### Backend
| Tecnologia | Uso |
|---|---|
| [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) | API REST |
| [Mercado Pago](https://www.mercadopago.com.br/developers) | Processamento de pagamentos |
| [Supabase](https://supabase.com/) | Persistência de pedidos |
| [Resend](https://resend.com/) | E-mails de confirmação de compra |
| [Axios](https://axios-http.com/) | Requisições HTTP (reCAPTCHA) |

## Principais funcionalidades

- **Catálogo de produtos** — listagem dinâmica a partir do Supabase, organizada por categorias e seções.
- **Busca de produtos** — campo de pesquisa na navbar com resultados em tempo real e adição rápida ao carrinho.
- **Carrossel promocional** — hero slider com banners clicáveis que levam aos detalhes do produto.
- **Vitrine de departamentos** — atalhos visuais para categorias de produtos.
- **Detalhes do produto** — página individual com informações, ofertas e produtos relacionados da mesma categoria.
- **Carrinho de compras** — adicionar, remover e alterar quantidades; persistência no `localStorage`.
- **Opções de entrega** — escolha entre receber em casa ou retirar em loja, com seleção de unidade e validação de CEP.
- **Checkout de endereço** — formulário completo com mapa interativo (Leaflet) para confirmar a localização.
- **Pagamento** — cartão de crédito (Mercado Pago Checkout) e PIX com QR Code e verificação automática de status.
- **Confirmação de compra** — tela de sucesso após pagamento aprovado.
- **E-mail de confirmação** — envio automático com resumo do pedido e endereço de entrega (via Resend).
- **Registro de pedidos** — pedidos aprovados são salvos no Supabase.
- **Login / cadastro** — tela de autenticação com validação de campos e reCAPTCHA.
- **Layout responsivo** — navbar mobile, menu de departamentos e navegação adaptada para dispositivos móveis.

## Estrutura do projeto

```
trevo-supermercado/
├── src/                    # Frontend React
│   ├── components/         # Componentes da interface
│   ├── context/            # Contextos (carrinho e checkout)
│   ├── modals/             # Modais (CEP, indisponibilidade)
│   ├── services/Supabase/  # Cliente Supabase (frontend)
│   └── Types/              # Tipagens TypeScript
├── backend/                # API Express
│   └── src/
│       ├── routes/         # Rotas de pagamento e PIX
│       ├── services/       # E-mail e pedidos
│       └── config/         # Mercado Pago e Supabase
└── public/                 # Assets estáticos
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Conta no [Supabase](https://supabase.com/) (tabelas `product` e `orders`)
- Conta no [Mercado Pago Developers](https://www.mercadopago.com.br/developers) (credenciais de teste ou produção)
- Conta no [Resend](https://resend.com/) (envio de e-mails)
- Chaves do [Google reCAPTCHA](https://www.google.com/recaptcha/) (opcional, para login)

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd trevo-supermercado
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na **raiz do projeto** (frontend):

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VITE_MERCADO_PAGO_PUBLIC_KEY=sua_public_key_do_mercado_pago
```

Crie um arquivo `.env` dentro da pasta **`backend/`**:

```env
PORT=3001
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_service_role_key_do_supabase
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_do_mercado_pago
RESEND_API_KEY=sua_api_key_do_resend
RECAPTCHA_SECRET_KEY=sua_secret_key_do_recaptcha
```

### 3. Instalar dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 4. Iniciar os servidores

Abra **dois terminais**:

**Terminal 1 — Frontend** (porta padrão `5173`):

```bash
npm run dev
```

**Terminal 2 — Backend** (porta `3001`):

```bash
cd backend
npm run dev
```

Acesse a aplicação em [http://localhost:5173](http://localhost:5173).

> O frontend consome a API do backend em `http://localhost:3001` para pagamentos (cartão e PIX) e verificação de reCAPTCHA. Ambos os servidores precisam estar em execução para o checkout funcionar.

## Scripts disponíveis

### Frontend (raiz)

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Executa o ESLint |

### Backend (`backend/`)

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia a API com hot reload (`tsx watch`) |
| `npm start` | Inicia a API em modo produção |

## Rotas da aplicação

| Rota | Descrição |
|---|---|
| `/` | Página inicial (hero, departamentos, produtos) |
| `/login` | Login e cadastro |
| `/departments` | Departamentos (mobile) |
| `/detalhesProduto/:id` | Detalhes de um produto |
| `/carrinho` | Carrinho de compras |
| `/endereço` | Formulário de endereço de entrega |
| `/pagamento` | Checkout (cartão ou PIX) |
| `/purchase-confirmed` | Confirmação de compra |

## API do backend

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/payment/process-payment` | Processa pagamento com cartão |
| `POST` | `/pix/create` | Gera cobrança PIX (QR Code) |
| `GET` | `/pix/status/:id` | Consulta status do pagamento PIX |
| `POST` | `/verify-captcha` | Valida token do reCAPTCHA |
