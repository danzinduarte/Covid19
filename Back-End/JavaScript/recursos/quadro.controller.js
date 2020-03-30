const dataContext = require('../dao/dao');
const { Op } = require('sequelize');

function carregaTudo(req,res){

	if(req.query) {
		return dataContext.Quadro.findAll()
		.then(function(quadrosFiltrados) {				
			res.status(200).json({
				sucesso:true,
				data: quadrosFiltrados
			})
		})
	} 
	dataContext.Quadro.findAll({
		}).then(function(quadro){
			return res.status(200).json({
			sucesso : true,
			data : quadro
		})
	}).catch(function(err)
	{
		return res.status(400).json({ 	
			sucesso: false,
			data : [],
			erros : err
		});
	})
}



module.exports = 
{
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo
}