const dataContext = require('../dao/dao');
const { Op } = require('sequelize');
const sequelize =  require('../dao/dao');

async function carregaTudo(req, res) {

	const ufs = await dataContext.Quadro.findAll({
		order: [
			['uf']
		],
		where: {
			[Op.or]: [
				{
					caso_suspeito: { [Op.gt] : 0 }
				},
				{
					caso_analise: { [Op.gt] : 0 }
				},
				{
					caso_confirmado: { [Op.gt] : 0 }
				},
				{
					caso_descartado: { [Op.gt] : 0 }
				}
			] 
		}
	});
	const cidadesBanco = await dataContext.Cidade.findAll({
		order: [
			['uf']
		]
	});

	const cidades = [];

	for (const cidade of cidadesBanco){
		const pessoas = await dataContext.Pessoa.findAll({
			where: {
				cidade_id: {
					[Op.eq]: cidade.id
				}
			}
			
		})
		
		
			const qtdCasoSuspeitos = pessoas.reduce((total,pessoa) =>
			total +
			(pessoa.situacao == 1 ? 1 : 0),
			0);
	
			const qtdCasoEmAnalise = pessoas.reduce((total,pessoa) =>
			total +
			(pessoa.situacao == 2 ? 1 : 0),
			0);
	
			const qtdCasoConfirmados = pessoas.reduce((total,pessoa) =>
			total +
			(pessoa.situacao == 3 ? 1 : 0),
			0);
	
			const qtdCasoDescartados = pessoas.reduce((total,pessoa) =>
			total +
			(pessoa.situacao == 4 ? 1 : 0),
			0);

			cidade.dataValues.caso_suspeito 	= qtdCasoSuspeitos;
			cidade.dataValues.caso_analise 		= qtdCasoEmAnalise;
			cidade.dataValues.caso_confirmado   = qtdCasoConfirmados;
			cidade.dataValues.caso_descartado   = qtdCasoDescartados;

			if(cidade.dataValues.caso_suspeito > 0 || 
			 cidade.dataValues.caso_analise > 0 || 
			 cidade.dataValues.caso_confirmado > 0 || 
			 cidade.dataValues.caso_descartado > 0 ){
				cidades.push(cidade);
			 }
		
	}
	
	return res.status(200).json({
		successo: true,
		data: {ufs, cidades}
	});

	

}


async function carregaCidades(req, res) {

	const cidades = await dataContext.Cidade.findAll({
		attributes: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']],
		order: [
			['uf']
		]
	}).then(function (quadro) {
		return res.status(200).json({
			successo: true,
			data: quadro,
		})
		
	})
	.catch((err) => {
		return res.status(400).json({
			successo: false,
			msg: 'Falha ao exibir os quadros',
			erros: err
		})
	})
	
}



function carregaPorId(req, res) {

	return dataContext.Quadro.findByPk(req.params.id)
		.then(function (quadro) {
			if (!quadro) {
				return res.status(404).json({
					sucesso: false,
					msg: "Quadro não encontrada.",
					erros: quadro
				})
			}
			return res.status(200).json({
				sucesso: true,
				data: quadro
			})
		})

}


function salvaQuadro(req, res) {

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
		.then(function (novoQuadro) {
			res.status(201).json({
				sucesso: true,
				data: novoQuadro,
				msg: "Quadro criado com sucesso"
			})
		})

		//Caso haja uma exceção
		.catch(function (err) {
			res.status(404).json({
				sucesso: false,
				msg: "Falha ao incluir o Quadro",
				erros: err
			})
		})
}

function excluiQuadro(req, res) {
	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		});
	}

	// Quando tu for trabalhar com apenas um model e que ele nao vai fazer outras insercoes em outras tabelas, vc nao precisa utilizar transacao
	dataContext.Quadro.findByPk(req.params.id)
		.then(function (restaurante) {

			if (!restaurante) {
				return res.status(404).json({
					sucesso: false,
					msg: "Quadro não encontrado."
				})
			}

			//restaurante = restaurante.get({ plain : true })
			dataContext.Quadro.destroy({ where: { id: req.params.id } })
				.then(function (result) {
					return res.status(200).json({
						sucesso: true,
						msg: 'Quadro excluido com sucesso!'
					})
				})

		}).catch(function (error) {
			return res.status(400).json({
				sucesso: false,
				msg: "Falha ao excluir o Quadro",
				erro: error
			});
		})
}

function atualizaQuadro(req, res) {

	//No front devo retornar um objeto restaurante com os dados
	let quadro = req.body
	if (!quadro) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
	}
	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Um id deve ser informado!"
		})
	}
	dataContext.Quadro.findByPk(req.params.id)
		.then(function (quadroBanco) {
			if (!quadroBanco) {
				return res.status(404).json({
					sucesso: false,
					msg: "Quadro não encontrada."
				});
			}
			// Campos da restaurante que serão alterados
			let updateFields = {
				uf: quadro.uf,
				caso_suspeito: quadro.caso_suspeito,
				caso_analise: quadro.caso_analise,
				caso_confirmado: quadro.caso_confirmado,
				caso_descartado: quadro.caso_descartado
			}
			// Atualiza somente os campos restaurante
			quadroBanco.update(updateFields)
				.then(function (quadroAtualizado) {
					return res.status(200).json({
						sucesso: true,
						msg: "Registro atualizado com sucesso",
						data: quadroAtualizado
					})
				})
		}).catch(function (error) {
			return res.status(400).json({
				sucesso: false,
				msg: "Falha ao atualizar o Quadro",
				erro : error
			});
		})
}

module.exports =
{
	//Quando for consumir irá pegar os nomes da primeira tabela
	carregaTudo: carregaTudo,
	carregaCidades: carregaCidades,
	carregaPorId: carregaPorId,
	salvaQuadro: salvaQuadro,
	excluiQuadro: excluiQuadro,
	atualizaQuadro: atualizaQuadro,

}