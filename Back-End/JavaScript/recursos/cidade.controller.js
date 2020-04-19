const dataContext = require('../dao/dao');
const { Op } = require('sequelize');

async function carregaTudo(req, res) {
	// payload da requisição
	const payload = req.body
	// verificação se a requisição não existe
	if (!payload) {
		return res.status(400).json({
			sucesso: false,
			data: [],
			msg: "não foi possivel encontrar as Cidades"
		});
	}
	//retornando os dados da cidade
	const cidade = await dataContext.Cidade.findAll();
	return res.status(200).json({
		sucesso: true,
		data: cidade
	})

}

async function carregaPorId(req, res) {
	// payload da requisição
	const payload = req.body
	// verificação se a requisição não existe
	if (!payload) {
		return res.status(400).json({
			sucesso: false,
			data: [],
			msg: "não foi possivel encontrar a Cidade"
		});
	}
	// pesquisa no banco de dados a cidade pelo id
	const cidade = await dataContext.Cidade.findByPk(req.params.id);
	// funcao para verificar se a cidade não existe
	if (!cidade) {
		return res.status(404).json({
			sucesso: false,
			msg: "Cidade não encontrada.",
			erros: cidade
		})
	}
	// exibição dos dados da cidade pelo id
	return res.status(200).json({
		sucesso: true,
		data: cidade
	})
}



async function salvaCidade(req, res) {
	try {
		// payload da requisição
		let payload = req.body
		// verificação se a requisição existe
		if (!payload) {
			return res.status(404).json({
				sucesso: false,
				msg: "Formato de entrada inválido.",
			})
		}

		//Criar um novo objeto cidade no banco de dados com os dados passados pelo formulário
		const cidade = await dataContext.Cidade.create(payload);
		// verifica se o objeto existe
		if (cidade) {
			// instancia um novo objeto quadro pela uf passada na requisição
			const ufBanco = await dataContext.Quadro.findByPk(cidade.uf);
			// verifica se a uf no quadro não existe no banco
			if (!ufBanco) {
				//cria o model pra uma nova uf
				const ufNovo = {
					uf: cidade.uf,
					caso_suspeito: 0,
					caso_analise: 0,
					caso_descartado: 0,
					caso_confirmado: 0
				}
				// cria uma uf passando o parametro do model do ufNovo
				const uf = await dataContext.Quadro.create(ufNovo);
				// verificação se a uf foi criada
				if (uf) {
					// após a criação da uf, retorna a msg da cidade criada
					return res.status(201).json({
						sucesso: true,
						data: cidade,
						msg: "Cidade Criada com Sucesso"
					})
				}
				// caso dê erro ao tentar criar a uf no quadro para a cidade.
				return res.status(400).json({
					sucesso: false,
					msg: "Erro ao criar a uf no Quadro"
				})
			}
		} else {
			// caso dê erro ao tentar criar a cidade
			return res.status(400).json({
				sucesso: false,
				msg: "Erro ao criar a Cidade"
			})
		}


	} catch (error) {
		// caso dê erro no payload 
		return res.status(404).json({
			sucesso: false,
			msg: "Erro ao tentar gerar a requisição"
		})
	}
}

async function excluiCidade(req, res) {
	// verifica se os parametros passados existem
	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})

	}
	// pesquisa as pessoas quando a cidade_id for igual ao dos parametros
	const pessoas = await dataContext.Pessoa.findAll({
		where: {
			cidade_id: {
				[Op.eq]: req.params.id
			}
		}
	})
	// verifica se no retorno das pessoas traz alguma cidade vinculada a pessoa
	if (pessoas.length > 0) {
		return res.status(400).json({
			sucesso: false,
			msg: "Atenção não é possível excluir esta cidade pois existem pessoas associadas à mesma"
		})
	}
	// busca no banco a cidade passada no parametro
	const cidade = await dataContext.Cidade.findByPk(req.params.id)
	// verifica se a cidade existe
	if (cidade) {
		// busca todas as cidades com a uf da cidade
		const cidades = await dataContext.Cidade.findAll({
			where: {
				uf: {
					[Op.eq]: cidade.uf
				}
			}
		});
		// verifica se  o retorno for igual somente a 1 
		if (cidades.length == 1) {
			// cria um objeto ufQuadro com o retorno do quadro passado pelo parametro da uf
			const ufQuadro = await dataContext.Quadro.findByPk(cidade.uf);
			// verifica se existe o objeto ufQuadro
			if (ufQuadro) {
				// exclui no quadro a uf da cidade que está sendo excluida
				await ufQuadro.destroy();
			}
		}
		// exclui a cidade 
		await cidade.destroy(cidade)
		// retorna a mensagem de exclusão da cidade
		return res.status(200).json({
			sucesso: true,
			msg: 'Cidade excluida com sucesso!'
		})
	}

}

async function atualizaCidade(req, res) {

	// cria a variavel de payload da requisicao
	let payload = req.body
	// verifica se a requisição existe
	if (!payload) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
	}
	// busca no banco  a cidade passada na requisição
	const cidade = await dataContext.Cidade.findByPk(req.params.id)
	if (cidade) {
		// se a cidade existir, busca todas as pessoas no banco que tem a cidade_id igual a da requisição
		const pessoas = await dataContext.Pessoa.findAll({
			where: {
				cidade_id: {
					[Op.eq]: cidade.id
				}
			}
		})
		// verifica se retorna alguma pessoa 
		if (pessoas.length > 0) {
			// verifica se a uf da pessoa é diferente da uf requisicao
			if (cidade.uf != payload.uf) {
				// cria uma variavel para os casos suspeitos com o parametro total e passando a pessoa
				const qtdCasoSuspeitos = pessoas.reduce((total, pessoa) =>
					total +
					// se a situação da pessoa for 1, total = +1  se não, total fica 0, o valor inicial é 0
					(pessoa.situacao == 1 ? 1 : 0),
					0);

				const qtdCasoEmAnalise = pessoas.reduce((total, pessoa) =>
					total +
					// se a situação da pessoa for 2, total = +1  se não, total fica 0, o valor inicial é 0
					(pessoa.situacao == 2 ? 1 : 0),
					0);

				const qtdCasoConfirmados = pessoas.reduce((total, pessoa) =>
					total +
					// se a situação da pessoa for 3, total = +1  se não, total fica 0, o valor inicial é 0
					(pessoa.situacao == 3 ? 1 : 0),
					0);

				const qtdCasoDescartados = pessoas.reduce((total, pessoa) =>
					total +
					// se a situação da pessoa for 4, total = +1  se não, total fica 0, o valor inicial é 0
					(pessoa.situacao == 4 ? 1 : 0),
					0);
				// cria uma variavel pra achar a uf no banco da cidade 
				const ufQuadro = await dataContext.Quadro.findByPk(cidade.uf);
				if (ufQuadro) {
					// se achar a uf, ele reduz o valor de cada campo
					ufQuadro.caso_suspeito -= qtdCasoSuspeitos;
					ufQuadro.caso_analise -= qtdCasoEmAnalise;
					ufQuadro.caso_confirmado -= qtdCasoConfirmados;
					ufQuadro.caso_descartado -= qtdCasoDescartados;
					// salva os valores
					ufQuadro.save();
				}
				// cria uma variavel pra receber a uf da  requisicao da cidade 
				const ufQuadroNovo = await dataContext.Quadro.findByPk(payload.uf);
				if (ufQuadroNovo) {
					// se receber a uf, ele adiciona os valores de cada campo
					ufQuadroNovo.caso_suspeito += qtdCasoSuspeitos;
					ufQuadroNovo.caso_analise += qtdCasoEmAnalise;
					ufQuadroNovo.caso_confirmado += qtdCasoConfirmados;
					ufQuadroNovo.caso_descartado += qtdCasoDescartados;
					// salva a uf na tabela quadro no banco
					ufQuadroNovo.save();
				} else {
					// se nao existir uf ele cria um novo model de uf e atrela os valores a essa nova uf.
					const ufNovo = {
						uf: payload.uf,
						caso_suspeito: qtdCasoSuspeitos,
						caso_analise: qtdCasoEmAnalise,
						caso_descartado: qtdCasoConfirmados,
						caso_confirmado: qtdCasoDescartados
					}
					// salva no banco quadro essa nova uf com os valores do model
					const uf = await dataContext.Quadro.Create(ufNovo)
					// verifica se a uf instanciada foi criada
					if (!uf) {
						// caso dê algum erro na criação da nova uf no banco
						return res.status(400).json({
							sucesso: false,
							msg: "Não foi possivel criar uma uf pra essa cidade"
						})
					}
				}
			}
		}

		// salva a cidade do banco, com o nome da cidade da requisiçaõ
		cidade.nome = payload.nome;
		// salva a uf da cidade do banco com o nome da uf da cidade da requisição
		cidade.uf = payload.uf;
		// salva a cidade no banco
		cidade.save();
		// retorna o sucesso no salvamento da requisição
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