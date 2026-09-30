import { type ErrorRequestHandler, type RequestHandler } from "express";
import { ValidationError } from "sequelize";

export const rotaNaoEncontrada: RequestHandler = (_requisicao, resposta) => {
  resposta.status(404).json({ mensagem: "Rota não encontrada" });
};

export const tratarErro: ErrorRequestHandler = (erro, _requisicao, resposta, _proximo) => {
  if (erro instanceof ValidationError) {
    resposta.status(400).json({
      mensagem: "Dados inválidos",
      erros: erro.errors.map((item) => item.message),
    });
    return;
  }

  console.error(erro);
  resposta.status(500).json({ mensagem: "Erro interno do servidor" });
};

