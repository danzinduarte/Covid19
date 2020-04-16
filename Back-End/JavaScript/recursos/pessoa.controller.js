const dataContext = require('../dao/dao');
const { Op } = require('sequelize');
function carregaTudo(req, res) {
	if (req.query) {
		return dataContext.Pessoa.findAll({
			attributes: { exclude: ['cidade_id'] },
			include: [
				{
					model: dataContext.Cidade

				}
			]
		})
			.then(function (pessoasFiltrados) {
				res.status(200).json({
					sucesso: true,
					data: pessoasFiltrados
				})
			})
	}
	return dataContext.Pessoa.findAll({
	}).then(function (pessoas) {
		pessoas = pessoas.map(function (pessoasRetornados) {
			pessoasRetornados = pessoasRetornados.get({ plain: true })

			return pessoasRetornados
		})
		return res.status(200).json({
			sucesso: true,
			data: pessoas
		})
	}).catch(function (err) {
		return res.status(404).json({
			sucesso: false,
			data: [],
			erros: err
		});
	})
}

async function carregaPorId(req, res) {

	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
	}

	return dataContext.Pessoa.findByPk(req.params.id, {
		attributes: { exclude: ['cidade_id'] },
		include: [{
			model: dataContext.Cidade
		}]
	})
		.then(function (pessoa) {
			if (!pessoa) {
				res.status(404).json({
					sucesso: false,
					msg: "Cidade não encontrada."
				})
				return;
			}
			pessoa = pessoa.get({ plain: true })
			res.status(200).json({
				sucesso: true,
				data: pessoa
			})
		})
}

async function salvaPessoa(req, res) {
	const payload = req.body

	if (!payload) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})

	}

	payload.situacao = 1;
	const pessoa = await dataContext.Pessoa.create(payload);

	if(pessoa){ 
		const criarProntuario = {
			pessoa_id : pessoa.id,
			situacao  : pessoa.situacao,
			data_hora : Date.now() 
		}
		const prontuario = await dataContext.Prontuario.create(criarProntuario)
		if(!prontuario){
			return res.status(400).json({
				sucesso : false,
				msg: "Erro ao criar o Prontuario"
			})
		}

		const cidade = await dataContext.Cidade.findByPk(pessoa.cidade_id);
		const ufCidade = await dataContext.Quadro.findByPk(cidade.uf);
		ufCidade.caso_suspeito += 1;

		ufCidade.save();

		return res.status(201).json({
			successo: true,
			data: pessoa,
			msg: 'Pessoa criada com sucesso'
		})
	}
	return res.status(400).json({
		sucesso : false,
		msg: "Erro ao Criar Pessoa"
	})
	
	
	
}


function excluiPessoa(req, res) {
	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
	}

	dataContext.Pessoa.findByPk(req.params.id)
		.then(function (pessoa) {
			if (!pessoa) {
				return res.status(404).json({
					sucesso: false,
					msg: "Pessoa não encontrado."
				})
			}
			dataContext.Pessoa.destroy({ where: { id: req.params.id } })
				.then(function (result) {
					return res.status(200).json({
						sucesso: true,
						msg: "Pessoa excluida com sucesso!"
					})
				})
		}).catch(function (error) {
			return res.status(400).json({
				sucesso: false,
				msg: "Falha ao excluir Pessoa",
				erro: error
			});
		})
}

function atualizaPessoa(req, res) {

	let pessoa = req.body

	if (!pessoa) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido"
		})
	}

	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Um id deve ser informado!"
		})
	}

	dataContext.Pessoa.findByPk(req.params.id)
		.then(function (pessoaBanco) {
			if (!pessoaBanco) {
				return res.status(404).json({
					sucesso: false,
					msg: "Pessoa não encontrada"
				});
			}
			let updateFields = {
				nome: pessoa.nome,
				data_nascimento: pessoa.data_nascimento,
				cidade_id: pessoa.cidade_id,
				situacao: pessoa.situacao
			}
			pessoaBanco.update(updateFields)
				.then(function (pessoaAtualizada) {
					return res.status(200).json({
						sucesso: true,
						msg: "Pessoa Atualizada com Sucesso",
						data: pessoaAtualizada
					})
				})
		}).catch(function (error) {
			return res.status(404).json({
				sucesso: false,
				msg: "Falha ao Atualizar a Pessoa",
				erro: error
			})
		})
}

module.exports =
{
	//Quando for consumir irá pegar os nomes da primeira tabela
	carregaTudo: carregaTudo,
	carregaPorId: carregaPorId,
	salva: salvaPessoa,
	exclui: excluiPessoa,
	atualiza: atualizaPessoa,
}