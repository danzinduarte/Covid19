
'use strict';
// criando o model de prontuario
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Prontuario', {
         // criando a primary key id da pessoa
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
         // criando a foreign key da pessoa
        pessoa_id: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Chave Estrangeira de Pessoa'
        },
        // criando a coluna situacao da pessoa
        situacao: {
            type: DataTypes.INTEGER,
            field: 'situacao',
            allowNull: false,
            comment: 'Situacao da Pessoa'
        },
        // criando a coluna data e hora do prontuario
        data_hora: {
            type: DataTypes.DATE,
            field: 'data_hora',
            allowNull: false,
            comment: 'Hora do Atendimento'
        }
    },
    // instanciando a tabela no banco 
        {
            schema: 'public',
            tableName: 'Prontuario',
            timestamps: false,
            name: {
                singular: 'prontuario',
                plural: 'prontuarios'
            }
        });
};
// exportando a tabela
module.exports.initRelations = function () {
    delete module.exports.initRelations;
    var dataContext = require('../dao');
    // criando uma variavel pra receber o model prontuario
    var Prontuario = dataContext.Prontuario;
     // criando uma variavel pra receber o model pessoa
    var Pessoa = dataContext.Pessoa;

     // instanciando a foreign key de pessoa_id
    Prontuario.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

