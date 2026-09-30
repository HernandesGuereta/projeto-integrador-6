import Produto from "../models/produto.model";

export interface DadosProduto {
  nome?: unknown;
  preco?: unknown;
}

function normalizarNome(nome: unknown): unknown {
  return typeof nome === "string" ? nome.trim() : nome;
}

export async function listar(): Promise<Produto[]> {
  return Produto.findAll({ order: [["id", "ASC"]] });
}

export async function buscarPorId(id: string): Promise<Produto | null> {
  return Produto.findByPk(id);
}

export async function criar(dados: DadosProduto): Promise<Produto> {
  return Produto.create({
    nome: normalizarNome(dados.nome) as string,
    preco: dados.preco as number,
  });
}

export async function atualizar(
  id: string,
  dados: DadosProduto,
): Promise<Produto | null> {
  const produto = await buscarPorId(id);

  if (!produto) {
    return null;
  }

  const atualizacoes: Partial<Pick<Produto, "nome" | "preco">> = {};

  if (dados.nome !== undefined) {
    atualizacoes.nome = normalizarNome(dados.nome) as string;
  }

  if (dados.preco !== undefined) {
    atualizacoes.preco = dados.preco as number;
  }

  await produto.update(atualizacoes);
  return produto;
}

export async function remover(id: string): Promise<boolean> {
  const produto = await buscarPorId(id);

  if (!produto) {
    return false;
  }

  await produto.destroy();
  return true;
}

