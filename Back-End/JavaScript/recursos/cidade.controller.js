const dataContext = require('../dao/dao');
const { Op } = require('sequelize');

function carregaTudo(req,res){

	if(req.query) {
		return dataContext.Cidade.findAll()
		.then(function(cidadesFiltradas) {				
			res.status(200).json({
				sucesso:true,
				data: cidadesFiltradas
			})
		})
	} 
	dataContext.Cidade.findAll({
		}).then(function(cidade){
			return res.status(200).json({
			sucesso : true,
			data : cidade
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

	return dataContext.Cidade.findByPk(req.params.id)
	.then(function(cidade) {
		if (!cidade) {
			return res.status(404).json({
				sucesso: false,
				msg: "Cidade não encontrada.",
				erros : cidade
			})
		}
		return res.status(200).json({
			sucesso: true,
			data: cidade
		})
	})
	
} 

function salvaCidade(req,res){
    
    let cidade = req.body

	if (!cidade) {
		return res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido.",
		})
    }	
    
	//Criar um novo objeto Visita no banco de dados com os dados passados pelo formulário
	dataContext.Cidade.create(cidade)

	//Cria uma promise que retorna o JSON
    .then(function(novaCidade){
        res.status(201).json({
            sucesso : true,
			data : novaCidade,
			msg : "Cidade criado com sucesso"
        })
	})
	
	//Caso haja uma exceção
    .catch(function(err){
        res.status(404).json({ 
            sucesso: false,
			msg: "Falha ao incluir o Cidade" ,
			erros : err
        })
    })
}
function excluiCidade(req,res)
{
	
	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		});
	}
	
	if(req.params.id){
		dataContext.Pessoa.findAll({
			where : {
				cidade_id: {
					[Op.eq] : req.params.id
				}
			}
		})
		.then(function(pessoasRetornadas) {				
			res.status(404).json({
				sucesso: false,
				msg: "A cidade está sendo usada!",
				erro : pessoasRetornadas
			})
		})
	}
	
	

	
	// Quando tu for trabalhar com apenas um model e que ele nao vai fazer outras insercoes em outras tabelas, 
	//vc nao precisa utilizar transacao
	dataContext.Cidade.findByPk(req.params.id)
		.then( function(cidade){
		
		if (!cidade) {
			return res.status(404).json({
				sucesso: false,
				msg: "Cidade não encontrada."
			})
		}

		
		dataContext.Cidade.destroy({ where : { id : req.params.id }})
		.then(function(result) {
			return res.status(200).json({
				sucesso: true,
				msg: 'Cidade excluida com sucesso!'
			})
		})

	}).catch(function(error){
		return res.status(400).json({ 
			sucesso: false,
			msg: "Falha ao excluir a Cidade",
			erro: error 
		});	
	})
}

function atualizaCidade(req,res){
	
	//No front devo retornar um objeto restaurante com os dados
	let cidade	= req.body
	if (!cidade) {
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
	dataContext.Cidade.findByPk(req.params.id)
	.then(function(cidadeBanco){
		if (!cidadeBanco) {
			return res.status(404).json({
				sucesso: false,
				msg: "Cidade não encontrada."				
			});
		}
		// Campos da restaurante que serão alterados
		let updateFields = {
			nome			: cidade.nome,
			uf 				: cidade.uf
		}
		// Atualiza somente os campos restaurante
		cidadeBanco.update(updateFields)
		.then(function(cidadeAtualizada){
			return res.status(200).json({
				sucesso:true,
				msg: "Registro atualizado com sucesso",
				data: cidadeAtualizada
			})	
		})
	}).catch(function(error){
		return res.status(400).json({ 
			sucesso: false,
			msg: "Falha ao atualizar a cidade" 
		});	
	})
}

module.exports = 
{
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaCidade,
    exclui 			: excluiCidade,
	atualiza 		: atualizaCidade,  
}