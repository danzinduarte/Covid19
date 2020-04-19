
'use strict';
// criação da conexão com o banco
var pg = require('pg');
let Sequelize = require('sequelize'),
    conexao = new Sequelize('Covid', 'postgres', '1234',

        {
            host: '127.0.0.1',
            port: 5432,
            dialect: 'postgres',
            logging: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
        });

var types = {
    FLOAT4: 700,
    FLOAT8: 701,
    NUMERIC: 1700,
    FLOAT4_ARRAY: 1021,
    FLOAT8_ARRAY: 1022,
    NUMERIC_ARRAY: 1231
},

    formataFloat = function fnFormataFloat(valor) {
        if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(valor))
            return Number(valor);
        return 0;
    }

pg.types.setTypeParser(types.FLOAT4, 'text', formataFloat);
pg.types.setTypeParser(types.FLOAT8, 'text', formataFloat);
pg.types.setTypeParser(types.NUMERIC, 'text', formataFloat);

/// Instancias dos modelos
var model = {};
var initialized = false;

function init() {
    delete module.exports.init;
    initialized = true;

    // Modelos

    model.Pessoa = conexao.import('./modelo/pessoa.js');
    model.Cidade = conexao.import('./modelo/cidade.js');
    model.Prontuario = conexao.import('./modelo/prontuario.js');
    model.Quadro = conexao.import('./modelo/quadro.js');


    // Arquivos

    require('./modelo/pessoa.js').initRelations();
    require('./modelo/cidade.js').initRelations();
    require('./modelo/prontuario.js').initRelations();
    require('./modelo/quadro.js').initRelations();


    return model;
}

model.Sequelize = Sequelize;
model.conexao = conexao;

module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;