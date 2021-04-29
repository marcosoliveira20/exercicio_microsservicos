const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
const ingressosPorClienteId = {};

app.post("/eventos", (request, response) => {
  /*try {
    funcoes[request.body.tipo](request.body.dados);
  } catch (error) {}*/
  response.status(200);
});

app.post("/clientes/:id/ingressos", async (request, response) => {
  const id = uuidv4();

  const { descricao, quantidade } = request.body;
  const ingresso = {
    id,
    descricao,
    quantidade,
  };

  const ingressosDoCliente = ingressosPorClienteId[request.params.id] || [];
  ingressosDoCliente.push(ingresso);

  ingressosPorClienteId[request.params.id] = ingressosDoCliente;
  await axios.post("http://localhost:7777/eventos", {
    tipo: "IngressoCriado",
    dados: {
      id,
      descricao,
      quantidade,
      clienteId: request.params.id,
    },
  });

  response.status(201).send(ingressosDoCliente);
});

app.get("/ingressos", (request, response) => {
  response.send(ingressosPorClienteId || []);
});

app.get("/clientes/:id/ingressos", (request, response) => {
  response.send(ingressosPorClienteId[request.params.id] || []);
});

app.put("/clientes/:id/ingressos", async (request, response) => {
  const { id, quantidade } = request.body;
  const ingresso = ingressosPorClienteId[request.params.id].find(
    (i) => i.id == id
  );

  if (!ingresso) {
    return response.status(400).send();
  }

  ingresso.quantidade = quantidade;
  await axios.post("http://localhost:7777/eventos", {
    tipo: "IngressoAtualizado",
    dados: {
      id,
      quantidade,
      clienteId: request.params.id,
    },
  });

  return response.status(200).json(ingresso);
});

app.delete("/clientes/:id/ingressos", (request, response) => {
  const { id } = request.body;
  const ingressoIndex = ingressosPorClienteId[request.params.id].findIndex(
    (i) => i.id == id
  );

  if (ingressoIndex < 0) {
    return response.status(404);
  }

  ingressosPorClienteId[request.params.id].splice(ingressoIndex, 1);

  return response.status(203);
});

app.listen(4444, () => {
  console.log("Ingressos was started in port: 4444 ⚡");
});
