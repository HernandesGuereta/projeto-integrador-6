import path from "node:path";
import express, { type Request, type Response } from "express";
import produtoRoutes from "./routes/produto.routes";
import { rotaNaoEncontrada, tratarErro } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/api", (_requisicao: Request, resposta: Response) => {
  resposta.status(200).json({ mensagem: "API de produtos funcionando" });
});

app.use("/produtos", produtoRoutes);
app.use(rotaNaoEncontrada);
app.use(tratarErro);

export default app;

