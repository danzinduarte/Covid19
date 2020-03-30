const dataContext = require('../dao/dao');
const { Op } = require('sequelize');

function carregaTudo(req,res){

	if(req.query) {
		return dataContext.Prontuario.findAll()
		.then(function(prontuariosFiltrados) {				
			res.status(200).json({
				sucesso:true,
				data: prontuariosFiltrados
			})
		})
	} 
	dataContext.Prontuario.findAll({
		}).then(function(prontuario){
			return res.status(200).json({
			sucesso : true,
			data : prontuario
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

function carregaPorId(req,res){

	return dataContext.Prontuario.findByPk(req.params.id)
	.then(function(prontuario) {
		if (!prontuario) {
			return res.status(404).json({
				sucesso: false,
				msg: "Prontuario não encontrado.",
				erros : prontuario
			})
		}
		return res.status(200).json({
			sucesso: true,
			data: prontuario
		})
	})
	
} 

function salvaProntuario(req,res){
    
    let prontuario = req.body

	if (!prontuario) {
		return res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido.",
		})
    }	
    prontuario.data_hora = Date.now();
	//Criar um novo objeto Visita no banco de dados com os dados passados pelo formulário
	dataContext.Prontuario.create(prontuario)

	//Cria uma promise que retorna o JSON
    .then(function(novaProntuario){
        res.status(201).json({
            sucesso : true,
			data : novaProntuario,
			msg : "Prontuario criado com sucesso"
        })
	})
	
	//Caso haja uma exceção
    .catch(function(err){
        res.status(404).json({ 
            sucesso: false,
			msg: "Falha ao incluir o Prontuario" ,
			erros : err
        })
    })
}
function excluiProntuario(req,res)
{
	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		});
	}

	// Quando tu for trabalhar com apenas um model e que ele nao vai fazer outras insercoes em outras tabelas, vc nao precisa utilizar transacao
	dataContext.Prontuario.findByPk(req.params.id)
		.then( function(restaurante){
		
		if (!restaurante) {
			return res.status(404).json({
				sucesso: false,
				msg: "Prontuario não encontrado."
			})
		}

		//restaurante = restaurante.get({ plain : true })
		dataContext.Prontuario.destroy({ where : { id : req.params.id }})
		.then(function(result) {
			return res.status(200).json({
				sucesso: true,
				msg: 'Prontuario excluido com sucesso!'
			})
		})

	}).catch(function(error){
		return res.status(400).json({ 
			sucesso: false,
			msg: "Falha ao excluir o Prontuario",
			erro: error 
		});	
	})
}

function atualizaProntuario(req,res){
	
	//No front devo retornar um objeto restaurante com os dados
	let prontuario	= req.body
	if (!prontuario) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})		
	}
	if(!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Um id deve ser informado!"
		})
	}
	dataContext.Prontuario.findByPk(req.params.id)
	.then(function(prontuarioBanco){
		if (!prontuarioBanco) {
			return res.status(404).json({
				sucesso: false,
				msg: "Prontuario não encontrado."				
			});
		}
		// Campos da restaurante que serão alterados
		let updateFields = {
			pessoa_id			: prontuario.pessoa_id,
			situacao 			: prontuario.situacao,
			data_hora			: prontuario.data_hora
		}
		// Atualiza somente os campos restaurante
		prontuarioBanco.update(updateFields)
		.then(function(prontuarioAtualizado){
			return res.status(200).json({
				sucesso:true,
				msg: "Registro atualizado com sucesso",
				data: prontuarioAtualizado
			})	
		})
	}).catch(function(error){
		return res.status(400).json({ 
			sucesso: false,
			msg: "Falha ao atualizar o Prontuario" 
		});	
	})
}

module.exports = 
{
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaProntuario,
    exclui 			: excluiProntuario,
	atualiza 		: atualizaProntuario,  
}