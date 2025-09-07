# Sobre o projeto

Repositório do projeto da equipe Inova Tech durante o programa da FWK

# Tech Stack

## Frontend
- **React**: Biblioteca para construção de interfaces de usuário.
- **Redux**: Gerenciamento de estado global da aplicação.
- **Toastify**: Exibição de notificações.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.

## Backend
- **Express**: Framework web para Node.js.
- **TypeScript**: Tipagem estática para maior segurança e produtividade.
- **MongoDB**: Banco de dados NoSQL.
- **ORM**: Utilizado para facilitar a manipulação do banco de dados MongoDB.

---
Este projeto foi desenvolvido utilizando as tecnologias acima para garantir escalabilidade, produtividade e uma melhor experiência de desenvolvimento.

# Utilização
O projeto é divido em **frontend**, que é a pasta raiz, e o **backend** portanto você deve rodar e instalar eles separadamente.
## Primeira vez rodando o projeto
Depois de clonar o repositório, antes de rodar é necessário instalar as dependências.

instalar dependencias frontend:
``` bash
  npm install
```

instalar dependencias do backend:
```bash
cd backend
  npm install
```

## Rodando o projeto
Rodar o frontend:
```bash
  npm run dev
```

Rodar o backend:
```bash
  cd backend
  npm run dev
```
O projeto estará rodando em ```http://localhost:5173/```

# Arquitetura do projeto
## Frontend
O frontend utiliza os principios da arquitetura [Bulletproof React](https://github.com/alan2207/bulletproof-react), considerando como uma `feature` o conjunto de componentes que compartilham uma responsabilidade funcional. São elas nesse projeto:
```
└── 📁 src/
    ├── 📁 features/
    │   ├── 📁 dashboard/
    │   │   └── 📄 // hooks, components, style...
    │   ├── 📁 settings/
    │   │   └── 📄
    │   ├── 📁 studentForm /
    │   │   └── 📄
    │   └── 📁 students /
    │       └── 📄
    └── 📄 //global hooks, style, services...
```
***

## Backend
O backend implementa um MVC de forma um pouco mais simplificada, deixando o models lidar somente com o Model do banco de dados e deixando a lógica dentro do próprio controller devido a baixa complexidade.
```
└── 📁 src/
    ├── 📁 config/
    ├── 📁 controllers/
    ├── 📁 middleware/
    ├── 📁 models/
    ├── 📁 routes/
    └── 📁 types/
```
***
