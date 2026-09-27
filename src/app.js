const path = require("path");
const express = require("express");
const produtoRoutes = require("./routes/produto.routes");
const {
  rotaNaoEncontrada,
  tratarErro,
} = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/api", (req, res) => {
  res.status(200).json({ mensagem: "API de produtos funcionando" });
});

app.use("/produtos", produtoRoutes);
app.use(rotaNaoEncontrada);
app.use(tratarErro);

module.exports = app;
