
'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Cidade', {
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
            comment: 'Nome da Cidade',
            
        },
        uf: {
            type: DataTypes.STRING(2),
            field: 'uf',
            allowNull: false,
            comment: 'UF da Cidade'
        }
    }, 
    {
        schema: 'public',
        tableName: 'Cidade',
        timestamps: false,
        name:{
            singular:'cidade',
            plural  :'cidades'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations;
    
};

