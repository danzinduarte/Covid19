//Express é o servidor HTTP
let rota = require('express').Router();


//definindo controllers
//Cidade
let cidadeController = require('../recursos/cidade.controller');

//Pessoa
let pessoaController = require('../recursos/pessoa.controller');

//Prontuario
let prontuarioController = require('../recursos/prontuario.controller');

//Quadro
let quadroController = require('../recursos/quadro.controller');

//Definindo as rotas 
//Prato
rota.get('/cidade', cidadeController.carregaTudo);
rota.get('/cidade/:id', cidadeController.carregaPorId);
rota.post('/cidade', cidadeController.salva);
rota.delete('/cidade/:id', cidadeController.exclui);
rota.put('/cidade/:id', cidadeController.atualiza);

//Pessoa
rota.get('/pessoa', pessoaController.carregaTudo);
rota.get('/pessoa/:id', pessoaController.carregaPorId);
rota.post('/pessoa', pessoaController.salva);
rota.delete('/pessoa/:id', pessoaController.exclui);
rota.put('/pessoa/:id', pessoaController.atualiza);

//Prontuario
rota.get('/prontuario', prontuarioController.carregaTudo);
rota.get('/prontuario/:id', prontuarioController.carregaPorId);
rota.post('/prontuario', prontuarioController.salva);
rota.delete('/prontuario/:id', prontuarioController.exclui);
rota.put('/prontuario/:id', prontuarioController.atualiza);

//Quadro
rota.get('/quadro', quadroController.carregaTudo);

//Torna todas as rotas públicas
module.exports = rota;