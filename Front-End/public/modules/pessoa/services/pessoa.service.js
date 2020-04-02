angular.module('app.pessoa')
.factory('PessoaService', function(api) {
    
    var pessoaFactory = {};

    pessoaFactory.getAll = function (pessoaId){
        var ds = new api.pessoa();
        return ds.$get({pessoa : pessoaId})
    }
    pessoaFactory.getById =function(pessoaId) {
        var ds      = new api.pessoa();
        ds.id   = pessoaId;
        return ds.$get();
    }

    pessoaFactory.save = function(pessoaModel){
        var ds               = new api.pessoa();
        ds.nome              = pessoaModel.nome;
        ds.data_nascimento   = pessoaModel.data_nascimento;
        ds.cidade_id         = pessoaModel.cidade_id;
        ds.situacao          = pessoaModel.situacao;   
        ds.id                = pessoaModel.id;
            if (ds.id) {
                return ds.$update();
            }
                return ds.$save();             				
                 				        
    }
    pessoaFactory.getPessoa = function (pessoaId ){
        try {
            var ds = new api.pessoa();
        
            return pessoaId ? ds.$get({ id : pessoaId}) : ds.$get();
        } catch (error) {
            console.log(error);    
        }
    }
    pessoaFactory.delete = function(pessoaId){
        var ds = new api.pessoa();
        ds.id = pessoaId
        return ds.$delete({id : pessoaId})
    }   
    pessoaFactory.getCidade = function (nome){
        var ds = new api.cidade();
        return ds.$get({ cidadeModel : nome})
    }
   
    return pessoaFactory;

});