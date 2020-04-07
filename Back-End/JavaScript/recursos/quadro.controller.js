const dataContext = require('../dao/dao');
const { Op } = require('sequelize');


async function carregaTudo(req,res){

	const geral = await dataContext.Quadro.findAll({
		limit: 10,
		order: [
			['uf', 'DESC']
		]
	})

	const cidade = await sequelize.query("select cidade_id, count(distinct case when situacao = 1 then pessoa.id end ) as caso_suspeito, count(distinct case when situacao = 2 then pessoa.id end ) as analise, count(distinct case when situacao = '3' then pessoa.id end) as confirmado, count(distinct case when situacao = 4 then pessoa.id end ) as descartado, cidade.nome, cidade.uf  from pessoa inner join cidade on pessoa.cidade_id = cidade.id group by cidade_id")
	return {
		geral, cidade
	}
}



function carregaPorId(req,res){

	return dataContext.Quadro.findByPk(req.params.id)
	.then(function(quadro) {
		if (!quadro) {
			return res.status(404).json({
				sucesso: false,
				msg: "Quadro não encontrada.",
				erros : quadro
			})
		}
		return res.status(200).json({
			sucesso: true,
			data: quadro
		})
	})
	
} 


function salvaQuadro(req,res){
    
    let quadro = req.body

	if (!quadro) {
		return res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido.",
		})
    }	
  
	//Criar um novo objeto Visita no banco de dados com os dados passados pelo formulário
	dataContext.Quadro.create(quadro)

	//Cria uma promise que retorna o JSON
    .then(function(novoQuadro){
        res.status(201).json({
            sucesso : true,
			data : novoQuadro,
			msg : "Quadro criado com sucesso"
        })
	})
	
	//Caso haja uma exceção
    .catch(function(err){
        res.status(404).json({ 
            sucesso: false,
			msg: "Falha ao incluir o Quadro" ,
			erros : err
        })
    })
}

function excluiQuadro(req,res)
{
	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		});
	}

	// Quando tu for trabalhar com apenas um model e que ele nao vai fazer outras insercoes em outras tabelas, vc nao precisa utilizar transacao
	dataContext.Quadro.findByPk(req.params.id)
		.then( function(restaurante){
		
		if (!restaurante) {
			return res.status(404).json({
				sucesso: false,
				msg: "Quadro não encontrado."
			})
		}

		//restaurante = restaurante.get({ plain : true })
		dataContext.Quadro.destroy({ where : { id : req.params.id }})
		.then(function(result) {
			return res.status(200).json({
				sucesso: true,
				msg: 'Quadro excluido com sucesso!'
			})
		})

	}).catch(function(error){
		return res.status(400).json({ 
			sucesso: false,
			msg: "Falha ao excluir o Quadro",
			erro: error 
		});	
	})
}

function atualizaQuadro(req,res){
	
		//No front devo retornar um objeto restaurante com os dados
		let quadro	= req.body
		if (!quadro) {
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
		dataContext.Quadro.findByPk(req.params.id)
		.then(function(quadroBanco){
			if (!quadroBanco) {
				return res.status(404).json({
					sucesso: false,
					msg: "Quadro não encontrada."				
				});
			}
			// Campos da restaurante que serão alterados
			let updateFields = {
				uf							: quadro.uf,
				caso_suspeito 				: quadro.caso_suspeito,
				caso_analise				: quadro.caso_analise,
				caso_confirmado				: quadro.caso_confirmado,
				caso_descartado				: quadro.caso_descartado
			}
			// Atualiza somente os campos restaurante
			quadroBanco.update(updateFields)
			.then(function(quadroAtualizado){
				return res.status(200).json({
					sucesso:true,
					msg: "Registro atualizado com sucesso",
					data: quadroAtualizado
				})	
			})
		}).catch(function(error){
			return res.status(400).json({ 
				sucesso: false,
				msg: "Falha ao atualizar o Quadro" 
			});	
		})
	}

module.exports = 
{
	//Quando for consumir irá pegar os nomes da primeira tabela
	carregaTudo  	: carregaTudo,
	carregaPorId : carregaPorId,
	salvaQuadro : salvaQuadro,
	excluiQuadro : excluiQuadro,
	atualizaQuadro : atualizaQuadro,

}