const dataContext = require('../dao/dao');
const { Op } = require('sequelize');
async function carregaTudo(req, res) {

	// cria o objeto payload a partir da requisição
	const payload = req.query
	// verifica se payload é valido
	if (!payload) {
		return res.status(404).json({
			sucesso: false,
			data: [],
			erros: err
		});
	}
	// cria o objeto pessoa, pegando todas as pessoas
	const pessoa = await dataContext.Pessoa.findAll({
		// ordena pelo id
		order: [
			['id']
		],
		// inclui o model de Cidade da pessoa
		include: [
			{
				model: dataContext.Cidade

			}
		]
	})
	// retorna ok caso a requisição seja satisfeita
	return res.status(200).json({
		sucesso: true,
		data: pessoa
	})
}


async function carregaPorId(req, res) {

	// cria o objeto payload a partir da requisição
	const payload = req.query
	// verifica se payload é valido
	if (!payload) {
		return res.status(404).json({
			sucesso: false,
			data: [],
			erros: err
		});
	}
	// cria o objeto pessoa buscando no banco o id da pessoa passado na requisição
	const pessoa = await dataContext.Pessoa.findByPk(req.params.id, {

		// inclui o model de Cidade da pessoa
		include: [
			{
				model: dataContext.Cidade

			}
		]
	})
	// retorna ok caso a requisição seja satisfeita
	return res.status(200).json({
		sucesso: true,
		data: pessoa
	})
}

async function salvaPessoa(req, res) {
	// cria o objeto payload da requisição
	const payload = req.body
	// verifica se a requisição existe
	if (!payload) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})

	}
	// regra de negocio da situação da pessoa sempre = 1 quando criado.
	payload.situacao = 1;
	// cria o objeto pessoa passando os dados da requisição
	const pessoa = await dataContext.Pessoa.create(payload);
	// verifica se o objeto foi criado
	if (pessoa) {
		// cria o model do prontuario para a pessoa
		const criarProntuario = {
			pessoa_id: pessoa.id,
			situacao: pessoa.situacao,
			data_hora: Date.now()
		}
		// cria o objeto prontuario passando os parametros do prontuario criado da pessoa
		const prontuario = await dataContext.Prontuario.create(criarProntuario)
		// verifica se ele existe e retorna o erro
		if (!prontuario) {
			return res.status(400).json({
				sucesso: false,
				msg: "Erro ao criar o Prontuario"
			})
		}
		// cria o objeto cidade com os parametros da cidade da pessoa.
		const cidade = await dataContext.Cidade.findByPk(pessoa.cidade_id);
		// cria o objeto cidade no quadro da uf, com a uf da cidade da pessoa
		const ufCidade = await dataContext.Quadro.findByPk(cidade.uf);
		// incrementa no quadro de cidade o valor de 1 para a situacao suspeita na cidade da pessoa criada
		ufCidade.caso_suspeito += 1;
		// salva o quadro da cidade.
		ufCidade.save();
		// retorna o status de criado pra pessoa.
		return res.status(201).json({
			successo: true,
			data: pessoa,
			msg: 'Pessoa criada com sucesso'
		})
	}
	// retorna o erro caso falhe ao criar a pessoa
	return res.status(400).json({
		sucesso: false,
		msg: "Erro ao Criar Pessoa"
	})
}


async function excluiPessoa(req, res) {

	// verifica se os parametros passados existem
	if (!req.params.id) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})

	}

	// cria o objeto pessoa pelo id passado nos parametros
	const pessoa = await dataContext.Pessoa.findByPk(req.params.id);
	// cria o objeto cidade com os parametros da cidade da pessoa.
	const cidade = await dataContext.Cidade.findByPk(pessoa.cidade_id);
	// cria o objeto ufquadro no quadro da uf, com a uf da cidade da pessoa
	const ufQuadro = await dataContext.Quadro.findByPk(cidade.uf);
	// verificação de cada situação, caso ela seja satisfeita diminuirá em 1 o quadro
	if (pessoa.situacao == 1) {
		ufQuadro.caso_suspeito -= 1;
	}
	if (pessoa.situacao == 2) {
		ufQuadro.caso_analise -= 1;
	}
	if (pessoa.situacao == 3) {
		ufQuadro.caso_confirmado -= 1;
	}
	if (pessoa.situacao == 4) {
		ufQuadro.caso_descartado -= 1;
	}

	// salva o quadro da cidade.
	ufQuadro.save();
	if (pessoa) {
		await pessoa.destroy(pessoa)
		return res.status(200).json({
			sucesso: true,
			msg: "Pessoa excluida com sucesso!"
		})
	}
	//caso dê erro na exclusao da pessoa
	return res.status(400).json({
		sucesso: false,
		msg: "Não foi possivel excluir a pessoa"
	})



}

async function atualizaPessoa(req, res) {
	// cria a variavel de payload da requisicao
	let payload = req.body
	// verifica se a requisição existe
	if (!payload) {
		return res.status(400).json({
			sucesso: false,
			msg: "Formato de entrada inválido"
		})
	}
	// cria o objeto da pessoa buscando pelo id passado na requisição
	const pessoa = await dataContext.Pessoa.findByPk(req.params.id)
	// verifica se a pessoa existe
	if (!pessoa) {
		return res.status(404).json({
			sucesso: false,
			msg: "Pessoa não encontrada"
		});
	}
	// caso o id da cidade da pessoa seja diferente do id da cidade passado na requisição..
	if (pessoa.cidade_id != payload.cidade_id) {
		// cria um objeto cidade buscando pela cidade vinculada a pessoa
		const cidadePessoa = await dataContext.Cidade.findByPk(pessoa.cidade_id);

		// cria um objeto cidade buscando pela cidade passada no payload
		const cidadePayload = await dataContext.Cidade.findByPk(payload.cidade_id);
		// verifica se a uf da cidade da pessoa também é diferente da uf da cidade passada na requisição
		if (cidadePessoa.uf != cidadePayload.uf) {
			// cria um objeto quadro a partir do objeto cidadePessoa
			const pessoaUfQuadro = await dataContext.Quadro.findByPk(cidadePessoa.uf);
			// cria um objeto quadro a partir do objeto cidade payload
			const payloadUfQuadro = await dataContext.Quadro.findByPk(cidadePayload.uf);

			// reduz do quadro os valores a partir da situação da pessoa no payload
			pessoaUfQuadro.caso_suspeito -= payload.situacao == 1 ? 1 : 0;
			pessoaUfQuadro.caso_analise -= payload.situacao == 2 ? 1 : 0;
			pessoaUfQuadro.caso_confirmado -= payload.situacao == 3 ? 1 : 0;
			pessoaUfQuadro.caso_descartado -= payload.situacao == 4 ? 1 : 0;

			// aumenta no quadro os valores a partir da situação da pessoa no payload
			payloadUfQuadro.caso_suspeito += payload.situacao == 1 ? 1 : 0;
			payloadUfQuadro.caso_analise += payload.situacao == 2 ? 1 : 0;
			payloadUfQuadro.caso_confirmado += payload.situacao == 3 ? 1 : 0;
			payloadUfQuadro.caso_descartado += payload.situacao == 4 ? 1 : 0;
			// salva a pessoa no quadro
			await pessoaUfQuadro.save();
			// salva o payload do quadro
			await payloadUfQuadro.save();
		}

	}



	// passa os parametros do payload para a pessoa
	pessoa.nome = payload.nome,
		pessoa.data_nascimento = payload.data_nascimento,
		pessoa.cidade_id = payload.cidade_id,
		pessoa.situacao = payload.situacao
	// salva a pessoa
	await pessoa.save()
	// retorna o status de atualizado
	return res.status(200).json({
		sucesso: true,
		data: pessoa,
		msg: "Pessoa atualizada com êxito."
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