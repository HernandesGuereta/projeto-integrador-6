import app from "./app";
import sequelize from "./config/database";

const porta = Number(process.env.PORT ?? 3000);

export async function iniciarServidor() {
  await sequelize.authenticate();
  await sequelize.sync();

  return app.listen(porta, () => {
    console.log(`Servidor disponível em http://localhost:${porta}`);
  });
}

if (require.main === module) {
  iniciarServidor().catch((erro: unknown) => {
    console.error("Não foi possível iniciar o servidor:", erro);
    process.exitCode = 1;
  });
}

