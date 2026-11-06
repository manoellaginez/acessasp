const mongoose = require('mongoose');

const CATEGORIAS = [
  'Calçada irregular ou quebrada',
  'Falta de rampa de acesso',
  'Semáforo sem sinal sonoro',
  'Falta de piso tátil',
  'Transporte sem acessibilidade',
  'Obstáculo na via',
  'Outro'
];

const PRIORIDADES = ['Baixa', 'Média', 'Alta'];

const ocorrenciaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true, minlength: 5, maxlength: 80 },
  categoria: { type: String, required: true, enum: CATEGORIAS },
  prioridade: { type: String, required: true, enum: PRIORIDADES },
  bairro: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  descricao: { type: String, required: true, trim: true, minlength: 10, maxlength: 400 },
  criadoEm: { type: Date, default: Date.now }
});

const Ocorrencia = mongoose.model('Ocorrencia', ocorrenciaSchema);

module.exports = { Ocorrencia, CATEGORIAS, PRIORIDADES };
