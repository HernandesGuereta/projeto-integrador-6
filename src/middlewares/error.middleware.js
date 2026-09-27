const { ValidationError } = require("sequelize");

function rotaNaoEncontrada(req, res) {
  return res.status(404).json({ mensagem: "Rota não encontrada" });
}

function tratarErro(error, req, res, next) {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: error.errors.map((item) => item.message),
    });
  }

  console.error(error);
  return res.status(500).json({ mensagem: "Erro interno do servidor" });
}

module.exports = { rotaNaoEncontrada, tratarErro };
