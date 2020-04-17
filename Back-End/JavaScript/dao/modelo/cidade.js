
'use strict';
// criando o model de cidade
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Cidade', {
        // criando a primary key id da cidade
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
        // criando a coluna nome da cidade
        nome: {
            type: DataTypes.STRING(60),
            field: 'nome',
            allowNull: false,
            comment: 'Nome da Cidade',

        },
         // criando a coluna uf da cidade
        uf: {
            type: DataTypes.STRING(2),
            field: 'uf',
            allowNull: false,
            comment: 'UF da Cidade'
        }
    },
     // instanciando a tabela no banco 
        {
            schema: 'public',
            tableName: 'Cidade',
            timestamps: false,
            name: {
                singular: 'cidade',
                plural: 'cidades'
            }
        });
};
// exportando a tabela
module.exports.initRelations = function () {
    delete module.exports.initRelations;

};

