# Projeto Integrador VI — CRUD de produtos

Aplicação web para cadastrar, consultar, editar e excluir produtos. O projeto usa Node.js e Express na API, Sequelize como ORM e SQLite como banco de dados relacional.

## Requisitos

- Node.js 20 ou superior
- npm

## Como executar

```bash
npm install
npm start
```

Abra `http://localhost:3000` para usar a interface. O banco `database.sqlite` é criado automaticamente na primeira execução.

Durante o desenvolvimento, também é possível usar:

```bash
npm run dev
```

## Testes e cobertura

```bash
npm test
```

Os testes de integração usam Jest, Supertest e um banco SQLite em memória. O comando gera o relatório na pasta `coverage` e falha se a cobertura global ficar abaixo de 90% em linhas, funções, instruções ou ramificações.

## Endpoints

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/produtos` | Lista os produtos |
| `GET` | `/produtos/:id` | Busca um produto |
| `POST` | `/produtos` | Cria um produto |
| `PUT` | `/produtos/:id` | Atualiza um produto |
| `DELETE` | `/produtos/:id` | Exclui um produto |

Exemplo de corpo para criação ou atualização:

```json
{
  "nome": "Teclado mecânico",
  "preco": 249.90
}
```

## Organização

- `public`: interface web responsiva.
- `src/config`: conexão do Sequelize.
- `src/models`: modelo relacional de produto.
- `src/services`: regras e operações de persistência.
- `src/controllers`: respostas HTTP.
- `src/routes`: rotas do CRUD.
- `tests`: testes de integração do CRUD e dos erros da API.
