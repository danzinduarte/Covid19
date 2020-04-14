angular.module('app.prontuario')
    .factory('ProntuarioService', function (api) {

        var prontuarioFactory = {};


        prontuarioFactory.getProntuario = function (prontuarioId) {
            try {
                var ds = new api.prontuario();

                return prontuarioId ? ds.$get({ id: prontuarioId }) : ds.$get({ id: prontuarioId });
            } catch (error) {
                console.log(error);
            }
        }
        prontuarioFactory.getById = function (pessoaId) {
            var ds = new api.prontuario();
            ds.id = pessoaId;
            return ds.$get();
        }

        prontuarioFactory.getPessoa = function (nome) {
            var ds = new api.pessoa();
            return ds.$get({ pessoaModel: nome })
        }
        
        prontuarioFactory.save = function (prontuarioModel) {
            var ds = new api.prontuario();
            ds.pessoa_id = prontuarioModel.pessoa_id;
            ds.situacao = prontuarioModel.situacao;
            ds.id = prontuarioModel.id;
            if (ds.id) {
                return ds.$update();
            }
            return ds.$save();

        }
        return prontuarioFactory;
    });