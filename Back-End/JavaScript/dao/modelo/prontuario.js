
'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Prontuario', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
        pessoa_id: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Chave Estrangeira de Pessoa'
        },
        situacao: {
            type: DataTypes.INTEGER,
            field: 'situacao',
            allowNull: false,
            comment: 'Situacao da Pessoa'
        },
        data_hora: {
            type: DataTypes.DATE,
            field: 'data_hora',
            allowNull: false,
            comment: 'Hora do Atendimento'
        }
    },
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

module.exports.initRelations = function () {
    delete module.exports.initRelations;
    var dataContext = require('../dao');
    var Prontuario = dataContext.Prontuario;
    var Pessoa = dataContext.Pessoa;


    Prontuario.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

