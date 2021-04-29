const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
const clientes = [];
contador = -1;

const funcoes = {
  ClienteClassificado: async (cliente) => {
    clientes[cliente.id].status = cliente.status;
    await axios.post("http://localhost:7777/eventos", {
      tipo: "ClienteCriado",
      dados: cliente,
    });
  },
};

app.post("/eventos", async (request, response) => {
  try {
    await funcoes[request.body.tipo](request.body.dados);
  } catch (e) {
    console.log(e);
  }
  response.status(200).send("ok");
});

app.post("/clientes", async (request, response) => {
  contador++;
  const { nome, endereco, idade } = request.body;
  const cliente = {
    id: contador,
    nome,
    endereco,
    idade,
    status: "aguardando",
  };

  clientes.push(cliente);

  await axios
    .post("http://localhost:7777/eventos", {
      tipo: "ClienteInserido",
      dados: {
        id: contador,
        nome,
        endereco,
        idade,
        status: "aguardando",
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  return response.status(201).send("Cliente created!");
});

app.get("/clientes", (request, response) => {
  response.send(clientes);
});

app.put("/clientes", async (request, response) => {
  const { id, nome, endereco, idade } = request.body;
  const cliente = clientes.find((c) => c.id == id);

  if (!cliente) {
    return response.status(400).send();
  }

  cliente.nome = nome;
  cliente.endereco = endereco;
  cliente.idade = idade;

  return response.status(200).json(cliente);
  /*await axios.post("http://localhost:10000/eventos", {
    tipo: "LembreteCriado",
    dados: {
      contador,
      texto,
    },
  });
  res.status(201).send(lembretes[contador]);*/
});

app.delete("/clientes/:id", (request, response) => {
  const { id } = request.params;
  const clienteIndex = clientes.findIndex((c) => c.id == id);

  if (clienteIndex < 0) {
    return response.status(404).send();
  }

  clientes.splice(clienteIndex, 1);

  return response.status(203).send("");
});

app.listen(3333, () => {
  console.log("Clientes was started in port: 3333 ⚡");
});
