// Popula o banco com dados de exemplo para a demonstração. Uso: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const { Ocorrencia } = require('../models/Ocorrencia');

const exemplos = [
  { titulo: 'Calçada quebrada em frente ao metrô', categoria: 'Calçada irregular ou quebrada', prioridade: 'Alta', bairro: 'Bela Vista', descricao: 'Buracos e pedras soltas dificultam a passagem de cadeirantes e idosos.' },
  { titulo: 'Sem rampa na entrada da UBS', categoria: 'Falta de rampa de acesso', prioridade: 'Alta', bairro: 'Mooca', descricao: 'A unidade de saúde só tem escadas, sem rampa de acesso lateral.' },
  { titulo: 'Semáforo sem aviso sonoro', categoria: 'Semáforo sem sinal sonoro', prioridade: 'Média', bairro: 'Pinheiros', descricao: 'Cruzamento movimentado sem sinal sonoro para pessoas com deficiência visual.' },
  { titulo: 'Piso tátil interrompido', categoria: 'Falta de piso tátil', prioridade: 'Média', bairro: 'Bela Vista', descricao: 'O piso tátil termina no meio da calçada, sem continuidade até o ponto.' },
  { titulo: 'Ônibus sem elevador funcionando', categoria: 'Transporte sem acessibilidade', prioridade: 'Alta', bairro: 'Santana', descricao: 'Linha frequente com plataforma elevatória quebrada há semanas.' },
  { titulo: 'Poste no meio da calçada', categoria: 'Obstáculo na via', prioridade: 'Baixa', bairro: 'Tatuapé', descricao: 'Poste reduz a largura da calçada e bloqueia a passagem de cadeira de rodas.' },
  { titulo: 'Rampa muito íngreme na praça', categoria: 'Falta de rampa de acesso', prioridade: 'Média', bairro: 'Mooca', descricao: 'A inclinação da rampa é excessiva e perigosa para cadeirantes.' },
  { titulo: 'Lixeiras bloqueando passagem', categoria: 'Obstáculo na via', prioridade: 'Baixa', bairro: 'Pinheiros', descricao: 'Lixeiras grandes ocupam toda a calçada em horário de pico.' }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acessasp');
    await Ocorrencia.deleteMany({});
    await Ocorrencia.insertMany(exemplos);
    console.log(`${exemplos.length} registros de exemplo inseridos.`);
  } catch (err) {
    console.error('Erro no seed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
