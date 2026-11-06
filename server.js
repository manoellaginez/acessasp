require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Ocorrencia, CATEGORIAS, PRIORIDADES } = require('./models/Ocorrencia');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acessasp';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Validação básica dos campos ----------
function validar(body) {
  const erros = [];
  const titulo = (body.titulo || '').trim();
  const bairro = (body.bairro || '').trim();
  const descricao = (body.descricao || '').trim();

  if (titulo.length < 5 || titulo.length > 80) {
    erros.push('O título deve ter entre 5 e 80 caracteres.');
  }
  if (!CATEGORIAS.includes(body.categoria)) {
    erros.push('Selecione uma categoria válida.');
  }
  if (!PRIORIDADES.includes(body.prioridade)) {
    erros.push('Selecione uma prioridade válida.');
  }
  if (bairro.length < 2 || bairro.length > 60) {
    erros.push('Informe o bairro (2 a 60 caracteres).');
  }
  if (descricao.length < 10 || descricao.length > 400) {
    erros.push('A descrição deve ter entre 10 e 400 caracteres.');
  }
  return erros;
}

// ---------- Rotas da API ----------

// GET - metadados do formulário (categorias e prioridades)
app.get('/api/opcoes', (req, res) => {
  res.json({ categorias: CATEGORIAS, prioridades: PRIORIDADES });
});

// POST - cadastra uma nova ocorrência
app.post('/api/ocorrencias', async (req, res) => {
  const erros = validar(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ ok: false, erros });
  }

  try {
    const nova = await Ocorrencia.create({
      titulo: req.body.titulo,
      categoria: req.body.categoria,
      prioridade: req.body.prioridade,
      bairro: req.body.bairro,
      descricao: req.body.descricao
    });
    res.status(201).json({
      ok: true,
      mensagem: 'Ocorrência registrada com sucesso! Obrigado por contribuir.',
      ocorrencia: nova
    });
  } catch (err) {
    console.error('Erro ao salvar ocorrência:', err.message);
    res.status(500).json({ ok: false, erros: ['Erro interno ao salvar. Tente novamente.'] });
  }
});

// GET - lista ocorrências (filtros opcionais: ?categoria=...&prioridade=...)
app.get('/api/ocorrencias', async (req, res) => {
  try {
    const filtro = {};
    if (CATEGORIAS.includes(req.query.categoria)) filtro.categoria = req.query.categoria;
    if (PRIORIDADES.includes(req.query.prioridade)) filtro.prioridade = req.query.prioridade;

    const lista = await Ocorrencia.find(filtro).sort({ criadoEm: -1 });
    res.json(lista);
  } catch (err) {
    console.error('Erro ao listar:', err.message);
    res.status(500).json({ ok: false, erros: ['Erro ao consultar os registros.'] });
  }
});

// GET - indicadores (processamento dos dados)
app.get('/api/indicadores', async (req, res) => {
  try {
    const [total, porCategoria, porPrioridade, porBairro] = await Promise.all([
      Ocorrencia.countDocuments(),
      Ocorrencia.aggregate([
        { $group: { _id: '$categoria', quantidade: { $sum: 1 } } },
        { $sort: { quantidade: -1 } }
      ]),
      Ocorrencia.aggregate([
        { $group: { _id: '$prioridade', quantidade: { $sum: 1 } } }
      ]),
      Ocorrencia.aggregate([
        { $group: { _id: { $toLower: '$bairro' }, nome: { $first: '$bairro' }, quantidade: { $sum: 1 } } },
        { $sort: { quantidade: -1 } },
        { $limit: 1 }
      ])
    ]);

    const prioridades = { Alta: 0, Média: 0, Baixa: 0 };
    porPrioridade.forEach((p) => { prioridades[p._id] = p.quantidade; });

    res.json({
      total,
      porCategoria: porCategoria.map((c) => ({ categoria: c._id, quantidade: c.quantidade })),
      porPrioridade: prioridades,
      percentualAlta: total > 0 ? Math.round((prioridades.Alta / total) * 100) : 0,
      bairroMaisAfetado: porBairro.length ? { nome: porBairro[0].nome, quantidade: porBairro[0].quantidade } : null
    });
  } catch (err) {
    console.error('Erro nos indicadores:', err.message);
    res.status(500).json({ ok: false, erros: ['Erro ao calcular indicadores.'] });
  }
});

// ---------- Tratamento de rota inexistente (404) ----------
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ ok: false, erros: ['Rota da API não encontrada.'] });
  }
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ---------- Inicialização ----------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado.');
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Falha ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
