
'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Pessoa', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },        
        nome: {
            type: DataTypes.STRING(60),
            field: 'nome',
            allowNull: false,
            comment: 'Nome da Pessoa',
            
        },
        data_nascimento: {
            type: DataTypes.DATE,
            field: 'data_nascimento',
            allowNull: false,
            comment: 'Data de Nascimento'
        },
        cidade_id: {
            type: DataTypes.INTEGER,
            field: 'cidade_id',
            allowNull: false,
            comment: 'Chave Estrangeira de Cidade'
        },
        situacao: {
            type: DataTypes.INTEGER,
            field: 'situacao',
            allowNull: false,
            comment: 'Situacao da Pessoa'
        }
    }, 
    {
        schema: 'public',
        tableName: 'Pessoa',
        timestamps: false,
        name:{
            singular:'pessoa',
            plural  :'pessoas'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations;
    var dataContext         = require('../dao');
    var Pessoa              = dataContext.Pessoa;
    var Cidade              = dataContext.Cidade;
 

    Pessoa.belongsTo(Cidade, {
        foreignKey: 'cidade_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

