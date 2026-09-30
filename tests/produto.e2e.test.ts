import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/database";
import Produto from "../src/models/produto.model";
import * as produtoService from "../src/services/produto.service";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Produto.destroy({ where: {}, truncate: true, restartIdentity: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("interface e informações da API", () => {
  test("serve a interface web", async () => {
    const resposta = await request(app).get("/");
    expect(resposta.status).toBe(200);
    expect(resposta.text).toContain("Gestão de produtos");
  });

  test("informa que a API está funcionando", async () => {
    const resposta = await request(app).get("/api");
    expect(resposta.status).toBe(200);
    expect(resposta.body.mensagem).toBe("API de produtos funcionando");
  });
});

describe("CRUD de produtos", () => {
  test("cria, lista e busca um produto", async () => {
    const criacao = await request(app)
      .post("/produtos")
      .send({ nome: "  Teclado mecânico  ", preco: 249.9 });

    expect(criacao.status).toBe(201);
    expect(criacao.body).toMatchObject({ nome: "Teclado mecânico" });
    expect(Number(criacao.body.preco)).toBe(249.9);

    const listagem = await request(app).get("/produtos");
    expect(listagem.status).toBe(200);
    expect(listagem.body).toHaveLength(1);

    const busca = await request(app).get(`/produtos/${criacao.body.id}`);
    expect(busca.status).toBe(200);
    expect(busca.body.nome).toBe("Teclado mecânico");
  });

  test("atualiza campos isoladamente e remove um produto", async () => {
    const produto = await Produto.create({ nome: "Mouse", preco: 80 });

    const nomeAtualizado = await request(app)
      .put(`/produtos/${produto.id}`)
      .send({ nome: "  Mouse sem fio  " });
    expect(nomeAtualizado.status).toBe(200);
    expect(nomeAtualizado.body.nome).toBe("Mouse sem fio");
    expect(Number(nomeAtualizado.body.preco)).toBe(80);

    const precoAtualizado = await request(app)
      .put(`/produtos/${produto.id}`)
      .send({ preco: 99.9 });
    expect(precoAtualizado.status).toBe(200);
    expect(Number(precoAtualizado.body.preco)).toBe(99.9);

    const exclusao = await request(app).delete(`/produtos/${produto.id}`);
    expect(exclusao.status).toBe(204);

    const busca = await request(app).get(`/produtos/${produto.id}`);
    expect(busca.status).toBe(404);
  });

  test("retorna 404 ao atualizar ou remover um produto inexistente", async () => {
    const atualizacao = await request(app)
      .put("/produtos/999")
      .send({ nome: "Produto inexistente" });
    const exclusao = await request(app).delete("/produtos/999");

    expect(atualizacao.status).toBe(404);
    expect(atualizacao.body.mensagem).toBe("Produto não encontrado");
    expect(exclusao.status).toBe(404);
    expect(exclusao.body.mensagem).toBe("Produto não encontrado");
  });
});

describe("validação e erros", () => {
  test("rejeita produto sem nome", async () => {
    const resposta = await request(app).post("/produtos").send({ preco: 10 });
    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe("Dados inválidos");
  });

  test("rejeita nome vazio e preço negativo", async () => {
    const resposta = await request(app)
      .post("/produtos")
      .send({ nome: "   ", preco: -1 });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erros).toEqual(
      expect.arrayContaining(["nome é obrigatório", "preço não pode ser negativo"]),
    );
  });

  test("retorna JSON para uma rota inexistente", async () => {
    const resposta = await request(app).get("/rota-inexistente");
    expect(resposta.status).toBe(404);
    expect(resposta.body.mensagem).toBe("Rota não encontrada");
  });

  test("trata erros inesperados sem expor detalhes internos", async () => {
    jest.spyOn(produtoService, "listar").mockRejectedValueOnce(new Error("falha simulada"));
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    const resposta = await request(app).get("/produtos");
    expect(resposta.status).toBe(500);
    expect(resposta.body.mensagem).toBe("Erro interno do servidor");
    expect(console.error).toHaveBeenCalled();
  });
});

