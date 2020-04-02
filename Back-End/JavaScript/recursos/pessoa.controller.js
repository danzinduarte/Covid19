const dataContext = require('../dao/dao');
function carregaTudo(req,res) {
	if (req.query) {
		return dataContext.Pessoa.findAll({
			attributes: { exclude: ['cidade_id']},
			include : [
				{
					model : dataContext.Cidade
					 
				}
			]
		})
		.then(function(pessoasFiltrados) {			
			res.status(200).json({
				sucesso:true,
				data: pessoasFiltrados
			})
		})
		
	}
	return dataContext.Pessoa.findAll({
	}).then(function(pessoas){
		pessoas = pessoas.map(function(pessoasRetornados){
			pessoasRetornados = pessoasRetornados.get({ plain : true})
			
			return pessoasRetornados
		})
    	return res.status(200).json({
        	sucesso : true,
            data : pessoas
        })
    }).catch(function(err){
		return res.status(404).json({ 	
			sucesso: false,
			data : [],
			erros : err
		});
	})
}

function carregaPorId(req,res){
	return dataContext.Pessoa.findByPk(req.params.id,{
		attributes: { exclude: ['cidade_id']},
		include: [{
			model: dataContext.Cidade
		}]
	})
	.then(function(pessoa){
		if (!pessoa){
			res.status(404).json({
				sucesso: false,
				msg: "Cidade não encontrada."
			})
			return;
		}
		pessoa = pessoa.get({plain : true})
        res.status(200).json({
			sucesso: true,
			data: pessoa
		})
    })
}

function salvaPessoa(req,res){
	let pessoa = req.body
	
	if (!pessoa){
		return res.status(400).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		
	}
	pessoa.situacao = 1
	dataContext.Pessoa.create(pessoa)
	.then(function(novaPessoa){
		return res.status(201).json({
			successo : true,
			data : novaPessoa,
			msg : 'Pessoa criada com sucesso'
		})
	})
	.catch((err) => {
		return res.status(400).json({
			successo : false,
			msg : 'Falha ao incluir a pessoa',
			erros : err
		})
	})
}


function excluiPessoa(req,res){
	if (!req.params.id){
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
	}

	dataContext.Pessoa.findByPk(req.params.id)
	.then(function (pessoa){
		if (!pessoa){
			return res.status(404).json({
				sucesso: false,
				msg: "Pessoa não encontrado."
			})
		}
		dataContext.Pessoa.destroy({ where : { id : req.params.id }})
		.then(function(result){
			return res.status(200).json({
				sucesso : true,
				msg : "Pessoa excluida com sucesso!"
			})
		})
	}).catch(function(error){
		return res.status(400).json({
			sucesso: false,
			msg: "Falha ao excluir Pessoa",
			erro: error
		});
	})
}

function atualizaPessoa(req,res){

	let pessoa = req.body

	if(!pessoa){
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido"
		})
	}

	if(!req.params.id){
		return res.status(400).json({
			sucesso: false,
			msg: "Um id deve ser informado!"
		})
	}

	dataContext.Pessoa.findByPk(req.params.id)
	.then(function(pessoaBanco){
		if(!pessoaBanco){
			return res.status(404).json({
				sucesso: false,
				msg: "Pessoa não encontrada"
			});
		}
		let updateFields = {
			nome : pessoa.nome,
			data_nascimento 		: pessoa.data_nascimento,
			cidade_id : pessoa.cidade_id,
			situacao : pessoa.situacao
		}
		pessoaBanco.update(updateFields)
		.then(function(pessoaAtualizada){
			return res.status(200).json({
				sucesso: true,
				msg: "Pessoa Atualizada com Sucesso",
				data: pessoaAtualizada
			})
		})
	}).catch(function(error){
	return res.status(404).json({
		sucesso: false,
		msg: "Falha ao Atualizar a Pessoa",
		erro : error
		})
	})
}

module.exports = 
{
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaPessoa,
    exclui 			: excluiPessoa,
	atualiza 		: atualizaPessoa,  
}