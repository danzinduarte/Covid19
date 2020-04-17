const dataContext = require('../dao/dao');
const { Op } = require('sequelize');

function carregaTudo(req, res) {

	if (req.query) {
		return dataContext.Cidade.findAll()
			.then(function (cidadesFiltradas) {
				res.status(200).json({
					sucesso: true,
					data: cidadesFiltradas
				})
			})
	}
	dataContext.Cidade.findAll({
	}).then(function (cidade) {
		return res.status(200).json({
			sucesso: true,
			data: cidade
		})
	}).catch(function (err) {
		return res.status(400).json({
			sucesso: false,
			data: [],
			erros: err
		});
	})
}

function carregaPorId(req, res) {

	return dataContext.Cidade.findByPk(req.params.id)
		.then(function (cidade) {
			if (!cidade) {
				return res.status(404).json({
					sucesso: false,
					msg: "Cidade não encontrada.",
					erros: cidade
				})
			}
			return res.status(200).json({
				sucesso: true,
				data: cidade
			})
		})

}

async function salvaCidade(req, res) {
	try {
		let payload = req.body

		if (!payload) {
			return res.status(404).json({
				sucesso: false,
				msg: "Formato de entrada inválido.",
			})
		}

		//Criar um novo objeto Visita no banco de dados com os dados passados pelo formulário
		const cidade = await dataContext.Cidade.create(payload);
		if (cidade) {
			const ufBanco = await dataContext.Quadro.findByPk(cidade.uf);
			if (!ufBanco) {
				const ufNovo = {
					uf: cidade.uf,
					caso_suspeito: 0,
					caso_analise: 0,
					caso_descartado: 0,
					caso_confirmado: 0
				}
				const uf = await dataContext.Quadro.create(ufNovo);
				if (uf) {
					return res.status(201).json({
						sucesso: true,
						data: cidade,
						msg: "Cidade Criada com Sucesso"
					})
				}
				return res.status(400).json({
					sucesso: false,
					msg: "Erro ao criar a uf no Quadro"
				})
			}
		} else {
			return res.status(400).json({
				sucesso: false,
				msg: "Erro ao criar a Cidade"
			})
		}


	} catch (error) {
		console.log(error)
	}
}

async function excluiCidade(req, res) {

	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})

	}
	const pessoas = await dataContext.Pessoa.findAll({
		where: {
			cidade_id: {
				[Op.eq]: req.params.id
			}
		}
	})
	if (pessoas.length > 0) {
		return res.status(400).json({
			sucesso: false,
			msg: "Atenção não é possível excluir esta cidade pois existem pessoas associadas à mesma"
		})
	}



	// Quando tu for trabalhar com apenas um model e que ele nao vai fazer outras insercoes em outras tabelas, 
	//vc nao precisa utilizar transacao
	const cidade = await dataContext.Cidade.findByPk(req.params.id)
		if(cidade){
			const cidades = await dataContext.Cidade.findAll({
				where: {
					uf: {
						[Op.eq]: cidade.uf
					}
				}
			});
			if(cidades.length == 1){
				const ufQuadro = await dataContext.Quadro.findByPk(cidade.uf);
				
				if(ufQuadro){
					await ufQuadro.destroy();
				}
			}			
			await cidade.destroy(cidade)
			return res.status(200).json({
				sucesso: true,
				msg: 'Cidade excluida com sucesso!'
			})
		}
		
}

async function atualizaCidade(req, res) {

	//No front devo retornar um objeto restaurante com os dados
	let payload = req.body
	if (!payload) {
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

	const cidade = await dataContext.Cidade.findByPk(req.params.id)
	if (cidade) {
		const pessoas = await dataContext.Pessoa.findAll({
			where: {
				cidade_id: {
					[Op.eq]: cidade.id
				}
			}
		})

		if (pessoas.length > 0) {
			if (cidade.uf != payload.uf) {
				const qtdCasoSuspeitos = pessoas.reduce((total, pessoa) =>
					total +
					(pessoa.situacao == 1 ? 1 : 0),
					0);

				const qtdCasoEmAnalise = pessoas.reduce((total, pessoa) =>
					total +
					(pessoa.situacao == 2 ? 1 : 0),
					0);

				const qtdCasoConfirmados = pessoas.reduce((total, pessoa) =>
					total +
					(pessoa.situacao == 3 ? 1 : 0),
					0);

				const qtdCasoDescartados = pessoas.reduce((total, pessoa) =>
					total +
					(pessoa.situacao == 4 ? 1 : 0),
					0);

				const ufQuadro = await dataContext.Quadro.findByPk(cidade.uf);
				if (ufQuadro) {
					ufQuadro.caso_suspeito -= qtdCasoSuspeitos;
					ufQuadro.caso_analise -= qtdCasoEmAnalise;
					ufQuadro.caso_confirmado -= qtdCasoConfirmados;
					ufQuadro.caso_descartado -= qtdCasoDescartados;

					
					ufQuadro.save();
					

				}

				const ufQuadroNovo = await dataContext.Quadro.findByPk(payload.uf);
				if (ufQuadroNovo) {
					ufQuadroNovo.caso_suspeito += qtdCasoSuspeitos;
					ufQuadroNovo.caso_analise += qtdCasoEmAnalise;
					ufQuadroNovo.caso_confirmado += qtdCasoConfirmados;
					ufQuadroNovo.caso_descartado += qtdCasoDescartados;

					ufQuadroNovo.save();
				} else {
					const ufNovo = {
						uf: payload.uf,
						caso_suspeito: qtdCasoSuspeitos,
						caso_analise: qtdCasoEmAnalise,
						caso_descartado: qtdCasoConfirmados,
						caso_confirmado: qtdCasoDescartados
					}

					const uf = await dataContext.Quadro.Create(ufNovo)
					if (!uf) {
						return res.status(400).json({
							sucesso: false,
							msg: "Não foi possivel criar uma uf pra essa cidade"
						})
					}
				}
			}
		}


		cidade.nome = payload.nome;
		cidade.uf = payload.uf;

		cidade.save();
		return res.status(200).json({
			sucesso: true,
			data: cidade,
			msg: "Cidade Atualizada com Sucesso."
		})
	}
}

module.exports =
{
	//Quando for consumir irá pegar os nomes da primeira tabela
	carregaTudo: carregaTudo,
	carregaPorId: carregaPorId,
	salva: salvaCidade,
	exclui: excluiCidade,
	atualiza: atualizaCidade,
}