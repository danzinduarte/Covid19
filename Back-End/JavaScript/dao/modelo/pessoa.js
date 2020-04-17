
'use strict';
// criando o model de pessoa
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Pessoa', {
        // criando a primary key id da pessoa
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
        // criando a coluna nome  da pessoa
        nome: {
            type: DataTypes.STRING(60),
            field: 'nome',
            allowNull: false,
            comment: 'Nome da Pessoa',

        }, 
         // criando a coluna data de nascimento da pessoa
        data_nascimento: {
            type: DataTypes.DATE,
            field: 'data_nascimento',
            allowNull: false,
            comment: 'Data de Nascimento'
        },
         // criando a coluna da foreing key da cidade
        cidade_id: {
            type: DataTypes.INTEGER,
            field: 'cidade_id',
            allowNull: false,
            comment: 'Chave Estrangeira de Cidade'
        },
        // criando a coluna situação da pessoa
        situacao: {
            type: DataTypes.INTEGER,
            field: 'situacao',
            allowNull: false,
            comment: 'Situacao da Pessoa'
        }
    },
    // instanciando a tabela no banco 
        {
            schema: 'public',
            tableName: 'Pessoa',
            timestamps: false,
            name: {
                singular: 'pessoa',
                plural: 'pessoas'
            }
        });
};
// exportando a tabela
module.exports.initRelations = function () {
    delete module.exports.initRelations;
    var dataContext = require('../dao');
    // criando uma variavel pra receber o model de pessoa
    var Pessoa = dataContext.Pessoa;
    // criando uma variavel pra receber o model de cidade
    var Cidade = dataContext.Cidade;

 // instanciando a foreign key de cidade_id
    Pessoa.belongsTo(Cidade, {
        foreignKey: 'cidade_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
};

