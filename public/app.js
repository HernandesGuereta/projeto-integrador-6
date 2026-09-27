const formulario = document.querySelector("#produto-form");
const campoId = document.querySelector("#produto-id");
const campoNome = document.querySelector("#nome");
const campoPreco = document.querySelector("#preco");
const botaoSalvar = document.querySelector("#salvar");
const botaoCancelar = document.querySelector("#cancelar");
const botaoRecarregar = document.querySelector("#recarregar");
const corpoTabela = document.querySelector("#produtos");
const mensagem = document.querySelector("#mensagem");

async function requisitar(caminho = "", opcoes = {}) {
  const resposta = await fetch(`/produtos${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erros?.join(". ") || dados.mensagem || "Falha na operação");
  }

  return dados;
}

function exibirMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  botaoSalvar.textContent = "Salvar produto";
  botaoCancelar.classList.add("oculto");
  document.querySelector("#titulo-formulario").textContent = "Novo produto";
}

function iniciarEdicao(produto) {
  campoId.value = produto.id;
  campoNome.value = produto.nome;
  campoPreco.value = Number(produto.preco).toFixed(2);
  botaoSalvar.textContent = "Atualizar produto";
  botaoCancelar.classList.remove("oculto");
  document.querySelector("#titulo-formulario").textContent = "Editar produto";
  campoNome.focus();
}

async function excluirProduto(produto) {
  const confirmou = window.confirm(`Excluir o produto “${produto.nome}”?`);

  if (!confirmou) return;

  try {
    await requisitar(`/${produto.id}`, { method: "DELETE" });
    exibirMensagem("Produto excluído com sucesso.");
    await carregarProdutos();
  } catch (error) {
    exibirMensagem(error.message, "erro");
  }
}

function criarBotao(rotulo, classe, acao) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = rotulo;
  botao.className = classe;
  botao.addEventListener("click", acao);
  return botao;
}

function renderizarProdutos(produtos) {
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

  const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  produtos.forEach((produto) => {
    const linha = document.createElement("tr");
    const valores = [produto.id, produto.nome, moeda.format(Number(produto.preco))];

    valores.forEach((valor) => {
      const celula = document.createElement("td");
      celula.textContent = valor;
      linha.append(celula);
    });

    const acoes = document.createElement("td");
    acoes.className = "acoes-tabela";
    acoes.append(
      criarBotao("Editar", "editar", () => iniciarEdicao(produto)),
      criarBotao("Excluir", "excluir", () => excluirProduto(produto)),
    );
    linha.append(acoes);
    corpoTabela.append(linha);
  });
}

async function carregarProdutos() {
  try {
    const produtos = await requisitar();
    renderizarProdutos(produtos);
  } catch (error) {
    exibirMensagem(error.message, "erro");
  }
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const id = campoId.value;
  const dados = {
    nome: campoNome.value,
    preco: Number(campoPreco.value),
  };

  try {
    await requisitar(id ? `/${id}` : "", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(dados),
    });
    exibirMensagem(id ? "Produto atualizado com sucesso." : "Produto criado com sucesso.");
    limparFormulario();
    await carregarProdutos();
  } catch (error) {
    exibirMensagem(error.message, "erro");
  }
});

botaoCancelar.addEventListener("click", limparFormulario);
botaoRecarregar.addEventListener("click", carregarProdutos);
carregarProdutos();
