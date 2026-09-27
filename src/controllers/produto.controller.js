const service = require("../services/produto.service");

exports.listar = async (req, res) => {
  const produtos = await service.listar();
  return res.status(200).json(produtos);
};

exports.buscarPorId = async (req, res) => {
  const produto = await service.buscarPorId(req.params.id);

  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }

  return res.status(200).json(produto);
};

exports.criar = async (req, res) => {
  const produto = await service.criar(req.body);
  return res.status(201).json(produto);
};

exports.atualizar = async (req, res) => {
  const produto = await service.atualizar(req.params.id, req.body);

  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }

  return res.status(200).json(produto);
};

exports.remover = async (req, res) => {
  const removido = await service.remover(req.params.id);

  if (!removido) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }

  return res.status(204).send();
};
