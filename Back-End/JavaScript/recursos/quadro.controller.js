const dataContext = require('../dao/dao');
const { Op } = require('sequelize');
const sequelize = require('../dao/dao');

async function carregaTudo(req, res) {
	// cria a variavel pra o quadro de todas as ufs
	const ufs = await dataContext.Quadro.findAll({
		// ordena pela uf (ordem alfabetica)
		order: [
			['uf']
		],
		where: {
			// uma condição para que só apareça no quadro quando algum dos casos estiver com 1
			[Op.or]: [
				{
					caso_suspeito: { [Op.gt]: 0 }
				},
				{
					caso_analise: { [Op.gt]: 0 }
				},
				{
					caso_confirmado: { [Op.gt]: 0 }
				},
				{
					caso_descartado: { [Op.gt]: 0 }
				}
			]
		}
	});
	// cria a variavel de todas as cidades do banco ordenados pela uf
	const cidadesBanco = await dataContext.Cidade.findAll({
		order: [
			['uf']
		]
	});
	// variavel vazia
	const cidades = [];
	// funcao pra buscar todas as cidades de cada uf
	for (const cidade of cidadesBanco) {
		// busca todas as pessoas de cada cidade
		const pessoas = await dataContext.Pessoa.findAll({
			where: {
				cidade_id: {
					[Op.eq]: cidade.id
				}
			}

		})

		// soma todos os casos suspeitos das pessoas. se a situacao for satisfeita soma +1, se nao soma em +0, com o valor inicial 0.
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
		// atribui pro quadro de cidades das pessoas o valor somado da funcao 
		cidade.dataValues.caso_suspeito 	= qtdCasoSuspeitos;
		cidade.dataValues.caso_analise 		= qtdCasoEmAnalise;
		cidade.dataValues.caso_confirmado 	= qtdCasoConfirmados;
		cidade.dataValues.caso_descartado 	= qtdCasoDescartados;
		
		// verifica se todos os casos são maiores que 0
		if (cidade.dataValues.caso_suspeito > 0 ||
			cidade.dataValues.caso_analise > 0 ||
			cidade.dataValues.caso_confirmado > 0 ||
			cidade.dataValues.caso_descartado > 0) {

			// faz o push das cidades passando o parametro os valores da funcao
			cidades.push(cidade);
		}

	}
	// retorna com status ok e traz os dois quadros, de uf e de cidades.
	return res.status(200).json({
		successo: true,
		data: { ufs, cidades }
	});

}




module.exports =
{
	//Quando for consumir irá pegar os nomes da primeira tabela
	carregaTudo: carregaTudo,


}