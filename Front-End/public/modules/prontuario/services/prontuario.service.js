angular.module('app.prontuario')
    .factory('ProntuarioService', function (api) {

        var prontuarioFactory = {};

        prontuarioFactory.getById = function (pessoaId) {
            var ds = new api.prontuario();
            ds.id = pessoaId;
            return ds.$get();
        }

        
        prontuarioFactory.getPessoa = function (pessoaId) {
            var ds = new api.pessoa();
            return ds.$get({ pessoaModel: pessoaId })
        }

        prontuarioFactory.save = function (prontuarioModel) {
            var ds          = new api.prontuario();
            ds.pessoa_id    = prontuarioModel.pessoa_id;
            ds.situacao     = prontuarioModel.situacao;
            ds.id           = prontuarioModel.id;
            return ds.$save();

        }
        return prontuarioFactory;
    });