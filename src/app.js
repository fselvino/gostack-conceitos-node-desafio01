const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  //uuid() - gera um id unico
  const repository = { id: uuid(), title, url, techs, likes: 0, }

  repositories.push(repository)

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)


  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repositorio não existe' })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes //recebe o valor de likes automaticamente
  }
  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  //Realiza busca pelo id vindo dos parametros
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  //se retornar  diferente de -1 é porque o repositorio existe
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1)
    //senão retorna erro
  } else {
    return response.status(400).json({ error: 'Repositorio não existe' })
  }
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)


  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repositorio não existe' })
  }

  //inclementa o campo likes a cada like recebido
  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex])
});

module.exports = app;
