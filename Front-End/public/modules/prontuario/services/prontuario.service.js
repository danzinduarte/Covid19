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
        return prontuarioFactory;
    });