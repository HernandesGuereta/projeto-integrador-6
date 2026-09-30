interface ProdutoDto {
  id: number;
  nome: string;
  preco: number | string;
}

interface ErroApi {
  mensagem?: string;
  erros?: string[];
}

function selecionar<T extends Element>(seletor: string): T {
  const elemento = document.querySelector<T>(seletor);
  if (!elemento) throw new Error(`Elemento não encontrado: ${seletor}`);
  return elemento;
}

const formulario = selecionar<HTMLFormElement>("#produto-form");
const campoId = selecionar<HTMLInputElement>("#produto-id");
const campoNome = selecionar<HTMLInputElement>("#nome");
const campoPreco = selecionar<HTMLInputElement>("#preco");
const botaoSalvar = selecionar<HTMLButtonElement>("#salvar");
const botaoCancelar = selecionar<HTMLButtonElement>("#cancelar");
const botaoRecarregar = selecionar<HTMLButtonElement>("#recarregar");
const corpoTabela = selecionar<HTMLTableSectionElement>("#produtos");
const mensagem = selecionar<HTMLElement>("#mensagem");
const tituloFormulario = selecionar<HTMLElement>("#titulo-formulario");

async function requisitar<T>(caminho = "", opcoes: RequestInit = {}): Promise<T | null> {
  const resposta = await fetch(`/produtos${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  if (resposta.status === 204) return null;

  const dados = (await resposta.json()) as T & ErroApi;
  if (!resposta.ok) {
    throw new Error(dados.erros?.join(". ") ?? dados.mensagem ?? "Falha na operação");
  }

  return dados;
}

function mensagemDoErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : "Ocorreu um erro inesperado";
}

function exibirMensagem(texto: string, tipo = "sucesso"): void {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

function limparFormulario(): void {
  formulario.reset();
  campoId.value = "";
  botaoSalvar.textContent = "Salvar produto";
  botaoCancelar.classList.add("oculto");
  tituloFormulario.textContent = "Novo produto";
}

function iniciarEdicao(produto: ProdutoDto): void {
  campoId.value = String(produto.id);
  campoNome.value = produto.nome;
  campoPreco.value = Number(produto.preco).toFixed(2);
  botaoSalvar.textContent = "Atualizar produto";
  botaoCancelar.classList.remove("oculto");
  tituloFormulario.textContent = "Editar produto";
  campoNome.focus();
}

async function excluirProduto(produto: ProdutoDto): Promise<void> {
  if (!window.confirm(`Excluir o produto “${produto.nome}”?`)) return;

  try {
    await requisitar(`/${produto.id}`, { method: "DELETE" });
    exibirMensagem("Produto excluído com sucesso.");
    await carregarProdutos();
  } catch (erro) {
    exibirMensagem(mensagemDoErro(erro), "erro");
  }
}

function criarBotao(rotulo: string, classe: string, acao: () => void): HTMLButtonElement {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = rotulo;
  botao.className = classe;
  botao.addEventListener("click", acao);
  return botao;
}

function renderizarProdutos(produtos: ProdutoDto[]): void {
  corpoTabela.replaceChildren();

  if (produtos.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 4;
    celula.className = "vazio";
    celula.textContent = "Nenhum produto cadastrado.";
    linha.append(celula);
    corpoTabela.append(linha);
    return;
  }

  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  produtos.forEach((produto) => {
    const linha = document.createElement("tr");
    [String(produto.id), produto.nome, moeda.format(Number(produto.preco))].forEach((valor) => {
      const celula = document.createElement("td");
      celula.textContent = valor;
      linha.append(celula);
    });

    const acoes = document.createElement("td");
    acoes.className = "acoes-tabela";
    acoes.append(
      criarBotao("Editar", "editar", () => iniciarEdicao(produto)),
      criarBotao("Excluir", "excluir", () => void excluirProduto(produto)),
    );
    linha.append(acoes);
    corpoTabela.append(linha);
  });
}

async function carregarProdutos(): Promise<void> {
  try {
    const produtos = await requisitar<ProdutoDto[]>();
    renderizarProdutos(produtos ?? []);
  } catch (erro) {
    exibirMensagem(mensagemDoErro(erro), "erro");
  }
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = campoId.value;

  try {
    await requisitar(id ? `/${id}` : "", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify({ nome: campoNome.value, preco: Number(campoPreco.value) }),
    });
    exibirMensagem(id ? "Produto atualizado com sucesso." : "Produto criado com sucesso.");
    limparFormulario();
    await carregarProdutos();
  } catch (erro) {
    exibirMensagem(mensagemDoErro(erro), "erro");
  }
});

botaoCancelar.addEventListener("click", limparFormulario);
botaoRecarregar.addEventListener("click", () => void carregarProdutos());
void carregarProdutos();

