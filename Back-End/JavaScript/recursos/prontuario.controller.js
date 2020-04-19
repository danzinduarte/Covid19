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

	const prontuario = await dataContext.Prontuario.findAll();
	if (prontuario) {
		return res.status(200).json({
			sucesso: true,
			data: prontuario
		})
	}
	return res.status(400).json({
		sucesso: false,
		data: [],
		erros: err
	});
}


async function carregaPorId(req, res) {
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
	//cria uma variavel pra receber todos os prontuarios da pessoa pelo id dela
	const prontuarios = await dataContext.Prontuario.findAll({
		where: {
			pessoa_id: {
				[Op.eq]: req.params.id
			}
		}
	})
	// se existir prontuario, traz a mensagem e mostra os dados.
	if (prontuarios) {
		return res.status(200).json({
			sucesso: true,
			data: prontuarios
		})
	}
	return res.status(400).json({
		sucesso: false,
		data: [],
		erros: err
	});

}

async function salvaProntuario(req, res) {
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
	// verifica se o id da pessoa da requisição existe
	if (!payload.pessoa_id) {
		return res.status(404).json({
			sucesso: false,
			msg: "Falha ao atualizar prontuario, a pessoa não existe",
		})
	}

	// cria o objeto pessoa pegando como parametro o id da pessoa na requisição
	const pessoa = await dataContext.Pessoa.findByPk(payload.pessoa_id)
	// verifica se a pessoa existe
	if (pessoa) {
		// aplica a regra de negocio da data 
		payload.data_hora = Date.now();
		// cria um prontuario com o parametro passado na requisição
		const prontuario = await dataContext.Prontuario.create(payload)
		// verifica se o prontuario existe
		if (prontuario) {
			// cria o objeto cidade com os parametros da cidade da pessoa.
			const cidade = await dataContext.Cidade.findByPk(pessoa.cidade_id)
			// cria o quadro no quadro da uf, com a uf da cidade da pessoa
			const quadro = await dataContext.Quadro.findByPk(cidade.uf)

			// diminui do quadro em -1 pra cada vez que a situacao da pessoa é satifaz a requisição, se não passa o valor 0
			quadro.caso_suspeito -= pessoa.situacao == 1 ? 1 : 0;
			quadro.caso_analise -= pessoa.situacao == 2 ? 1 : 0;
			quadro.caso_confirmado -= pessoa.situacao == 3 ? 1 : 0;
			quadro.caso_descartado -= pessoa.situacao == 4 ? 1 : 0;

			// aumenta no quadro em +1 pra cada vez que a situacao da pessoa é satifaz a requisição, se não passa o valor 0
			quadro.caso_suspeito += payload.situacao == 1 ? 1 : 0;
			quadro.caso_analise += payload.situacao == 2 ? 1 : 0;
			quadro.caso_confirmado += payload.situacao == 3 ? 1 : 0;
			quadro.caso_descartado += payload.situacao == 4 ? 1 : 0;

			// salva o quadro com as informações anteriormente
			await quadro.save();

			// passa pra pessoa.situacao, o valor da situação do prontuario
			pessoa.situacao = prontuario.situacao;
			// salva a pessoa com a informação atualizada
			await pessoa.save();
			// retorna o status de que o prontuario foi criado
			return res.status(201).json({
				sucesso: true,
				data: prontuario,
				msg: "Prontuario Criado Com sucesso."
			})
		}
		// retorna a mensagem de erro ao criar o prontuario
		return res.status(400).json({
			sucesso: false,
			msg: "Prontuario não foi criado"
		})
	}
	// retorna a mensagem de erro caso a pessoa não seja encontrada
	return res.status(404).json({
		sucesso: false,
		msg: "Pessoa não foi encontrada"
	})
}

module.exports =
{
	//Quando for consumir irá pegar os nomes da primeira tabela
	carregaTudo: carregaTudo,
	carregaPorId: carregaPorId,
	salvaProntuario: salvaProntuario,
}