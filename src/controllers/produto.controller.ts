import { type Request, type Response } from "express";
import * as service from "../services/produto.service";

export async function listar(_requisicao: Request, resposta: Response): Promise<void> {
  const produtos = await service.listar();
  resposta.status(200).json(produtos);
}

export async function buscarPorId(
  requisicao: Request<{ id: string }>,
  resposta: Response,
): Promise<void> {
  const produto = await service.buscarPorId(requisicao.params.id);

  if (!produto) {
    resposta.status(404).json({ mensagem: "Produto não encontrado" });
    return;
  }

  resposta.status(200).json(produto);
}

export async function criar(requisicao: Request, resposta: Response): Promise<void> {
  const produto = await service.criar(requisicao.body);
  resposta.status(201).json(produto);
}

export async function atualizar(
  requisicao: Request<{ id: string }>,
  resposta: Response,
): Promise<void> {
  const produto = await service.atualizar(requisicao.params.id, requisicao.body);

  if (!produto) {
    resposta.status(404).json({ mensagem: "Produto não encontrado" });
    return;
  }

  resposta.status(200).json(produto);
}

export async function remover(
  requisicao: Request<{ id: string }>,
  resposta: Response,
): Promise<void> {
  const removido = await service.remover(requisicao.params.id);

  if (!removido) {
    resposta.status(404).json({ mensagem: "Produto não encontrado" });
    return;
  }

  resposta.status(204).send();
}

