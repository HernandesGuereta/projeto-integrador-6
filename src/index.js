const app = require("./app");
const sequelize = require("./config/database");

const porta = process.env.PORT || 3000;

async function iniciarServidor() {
  await sequelize.authenticate();
  await sequelize.sync();

  return app.listen(porta, () => {
    console.log(`Servidor disponível em http://localhost:${porta}`);
  });
}

if (require.main === module) {
  iniciarServidor().catch((error) => {
    console.error("Não foi possível iniciar o servidor:", error);
    process.exitCode = 1;
  });
}

module.exports = { iniciarServidor };
