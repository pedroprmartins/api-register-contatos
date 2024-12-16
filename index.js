const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Caminho do arquivo JSON
const dbPath = path.join(__dirname, 'data', 'db.json');

// Função auxiliar para ler o JSON
const readDB = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Rota GET - Listar contatos
app.get('/api/contatos', (req, res) => {
  const db = readDB();
  res.json(db.contatos);
});

// Rota POST - Adicionar um contato
app.post('/api/contatos', (req, res) => {
  const db = readDB();
  const novoContato = { id: Date.now(), ...req.body };

  db.contatos.push(novoContato);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(201).json(novoContato);
});

// Rota DELETE - Remover um contato
app.delete('/api/contatos/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const contatosFiltrados = db.contatos.filter((contato) => contato.id !== id);

  db.contatos = contatosFiltrados;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(204).send();
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
