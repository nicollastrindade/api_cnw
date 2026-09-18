require('dotenv').config();

const express = require('express');
const path = require('path');
const db = require('./conexao');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, 'public'))); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve a página HTML na raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/funcionarios', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        f.id,
        f.nome AS nome_funcionario,
        f.cargo,
        f.salario,
        f.data_contratacao,
        d.nome AS departamento,
        d.localizacao
      FROM funcionarios f
      INNER JOIN departamentos d ON f.departamento_id = d.id
      ORDER BY f.salario DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: 'Não foi possível consultar o banco.',
      detalhe: error.message,
    });
  }
});

app.get('/funcionarios/cadastrar', (req, res) => {
  res.json({
    metodo: 'POST',
    rota: '/funcionarios/cadastrar',
    mensagem: 'Use uma requisição POST para cadastrar um funcionário.',
  });
});

app.post('/funcionarios/cadastrar', async (req, res) => {
  const {
    nome,
    cargo,
    salario,
    data_contratacao: dataContratacao,
    departamento_id: departamentoId,
  } = req.body;

  const camposObrigatorios = {
    nome,
    cargo,
    salario,
    data_contratacao: dataContratacao,
    departamento_id: departamentoId,
  };

  const ausentes = Object.entries(camposObrigatorios)
    .filter(([, valor]) => valor === undefined || valor === null || valor === '')
    .map(([campo]) => campo);

  if (ausentes.length > 0) {
    return res.status(400).json({
      erro: 'Campos obrigatórios ausentes.',
      campos: ausentes,
    });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO funcionarios
        (nome, cargo, salario, data_contratacao, departamento_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, cargo, salario, dataContratacao, departamentoId],
    );

    return res.status(201).json({
      id: result.insertId,
      nome,
      cargo,
      salario,
      data_contratacao: dataContratacao,
      departamento_id: departamentoId,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      erro: 'Não foi possível criar o funcionário.',
      detalhe: error.message,
    });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }
  return next(error);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API de funcionários rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
