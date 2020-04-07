const dataContext = require('../dao/dao');
const { Op } = require('sequelize');

function carregaTudo(req, res) {

	if (req.query) {
		return dataContext.Prontuario.findAll()
			.then(function (prontuariosFiltrados) {
				res.status(200).json({
					sucesso: true,
					data: prontuariosFiltrados
				})
			})
	}
	dataContext.Prontuario.findAll({
	}).then(function (prontuario) {
		return res.status(200).json({
			sucesso: true,
			data: prontuario
		})
	}).catch(function (err) {
		return res.status(400).json({
			sucesso: false,
			data: [],
			erros: err
		});
	})
}

async function carregaPorId(req, res) {

	const prontuarios = await dataContext.Prontuario.findAll({
		where: {
			pessoa_id: {
				[Op.eq]: req.params.id
			}
		}
	}).then(function (prontuarios) {
		return res.status(200).json({
			sucesso: true,
			data: prontuarios
		})
	}).catch(function (err) {
		return res.status(400).json({
			sucesso: false,
			data: [],
			erros: err
		});
	})
}

function salvaProntuario(req, res) {

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
		.then(function (novaProntuario) {
			res.status(201).json({
				sucesso: true,
				data: novaProntuario,
				msg: "Prontuario criado com sucesso"
			})
		})

		//Caso haja uma exceção
		.catch(function (err) {
			res.status(404).json({
				sucesso: false,
				msg: "Falha ao incluir o Prontuario",
				erros: err
			})
		})
}

module.exports =
{
	//Quando for consumir irá pegar os nomes da primeira tabela
	carregaTudo: carregaTudo,
	carregaPorId: carregaPorId,
	salva: salvaProntuario,
}