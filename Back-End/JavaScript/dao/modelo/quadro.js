'use strict';
// criando o model do quadro
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Quadro', {
        // criando a primary key uf do quadro
        uf: {
            type: DataTypes.STRING(2),
            field: 'uf',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
        caso_suspeito: {
            type: DataTypes.INTEGER,
            field: 'caso_suspeito',
            allowNull: false,
            comment: 'Caso de Corona Virus Suspeito'
        },
        caso_analise: {
            type: DataTypes.INTEGER,
            field: 'caso_analise',
            allowNull: false,
            comment: 'Caso de Corona Virus em Analise'
        },
        caso_confirmado: {
            type: DataTypes.INTEGER,
            field: 'caso_confirmado',
            allowNull: false,
            comment: 'Caso de Corona Virus Confirmado'
        },
        caso_descartado: {
            type: DataTypes.INTEGER,
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

