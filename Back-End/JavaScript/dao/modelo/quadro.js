'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Quadro', {
        uf: {
            type: DataTypes.STRING(2),
            field: 'uf',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
        caso_suspeito: {
            type: DataTypes.STRING(2),
            field: 'caso_suspeito',
            allowNull: false,
            comment: 'Caso de Corona Virus Suspeito'
        },
        caso_analise: {
            type: DataTypes.STRING(2),
            field: 'caso_analise',
            allowNull: false,
            comment: 'Caso de Corona Virus em Analise'
        },
        caso_confirmado: {
            type: DataTypes.STRING(2),
            field: 'caso_confirmado',
            allowNull: false,
            comment: 'Caso de Corona Virus Confirmado'
        },
        caso_descartado: {
            type: DataTypes.STRING(2),
            field: 'caso_descartado',
            allowNull: false,
            comment: 'Caso de Corona Virus Descartado'
        }
    },
        {
            schema: 'public',
            tableName: 'Quadro',
            timestamps: false,
            name: {
                singular: 'quadro',
                plural: 'quadro'
            }
        });
};

module.exports.initRelations = function () {
    delete module.exports.initRelations;
};

