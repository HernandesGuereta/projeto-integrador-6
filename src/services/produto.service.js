const Produto = require("../models/produto.model");

function normalizarNome(nome) {
  return typeof nome === "string" ? nome.trim() : nome;
}

async function listar() {
  return Produto.findAll({ order: [["id", "ASC"]] });
}

async function buscarPorId(id) {
  return Produto.findByPk(id);
}

async function criar(dados) {
  return Produto.create({
    nome: normalizarNome(dados.nome),
    preco: dados.preco,
  });
}

async function atualizar(id, dados) {
  const produto = await buscarPorId(id);

  if (!produto) {
    return null;
  }

  const atualizacoes = {};

  if (dados.nome !== undefined) {
    atualizacoes.nome = normalizarNome(dados.nome);
  }

  if (dados.preco !== undefined) {
    atualizacoes.preco = dados.preco;
  }

  await produto.update(atualizacoes);
  return produto;
}

async function remover(id) {
  const produto = await buscarPorId(id);

  if (!produto) {
    return false;
  }

  await produto.destroy();
  return true;
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
};
