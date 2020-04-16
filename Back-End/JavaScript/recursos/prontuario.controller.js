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

async function salvaProntuario(req, res) {

	const payload = req.body

	if (!payload.pessoa_id) {
		return res.status(404).json({
			sucesso: false,
			msg: "Falha ao atualizar prontuario, a pessoa não existe",
		})
	}
	
	if (!payload) {
		return res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido.",
		})
	}
	const pessoa = await dataContext.Pessoa.findByPk(payload.pessoa_id)
	if(pessoa){
		payload.data_hora = Date.now();
		const prontuario = await dataContext.Prontuario.create(payload)
		if(prontuario){
			pessoa.situacao = prontuario.situacao;

			pessoa.save();
			return res.status(201).json({
				sucesso : true,
				data : prontuario,
				msg : "Prontuario Criado Com sucesso."
			})
		}
		return res.status(400).json({
			sucesso : false,
			msg : "Prontuario não foi criado"
		})
	}
	return res.status(404).json({
		sucesso : false,
		msg : "Pessoa não foi encontrada"
	})
}

module.exports =
{
	//Quando for consumir irá pegar os nomes da primeira tabela
	carregaTudo: carregaTudo,
	carregaPorId: carregaPorId,
	salvaProntuario: salvaProntuario,
}