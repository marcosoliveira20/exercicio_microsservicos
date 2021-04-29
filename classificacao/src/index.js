const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const funcoes = {
  ClienteInserido: async (cliente) => {
    cliente.status = Number(cliente.idade) >= 60 ? "prioritário" : "comum";
    await axios.post("http://localhost:7777/eventos", {
      tipo: "ClienteClassificado",
      dados: cliente,
    });
  },
};

app.post("/eventos", (request, response) => {
  try {
    funcoes[request.body.tipo](request.body.dados);
  } catch (error) {
    response.status(400).send("Não foi poassivel criar o ingresso!");
  }
  response.status(200);
});

app.listen(5555, () => {
  console.log("Classificacao was started in port: 5555 ⚡");
});
