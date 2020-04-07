angular.module('app.cidade')
.factory('CidadeService', function(api) {
    
    var cidadeFactory = {};

    cidadeFactory.getAll = function(coluna) {
        var ds = new api.cidade();
            return ds.$get({coluna : coluna})
    };

    cidadeFactory.getCidades = function(cidade, coluna) {
        if(cidade.length < 3)
            cidade = null
       
        var ds = new api.returnCidade();
            return ds.$get({cidade : cidade, coluna})
    };
    cidadeFactory.getById =function(cidadeId) {
        var ds      = new api.cidade();
        ds.id   = cidadeId;
        return ds.$get();
    }

    cidadeFactory.save = function(cidadeModel){
        var ds               = new api.cidade();
        ds.nome              = cidadeModel.nome;
        ds.uf                = cidadeModel.uf;
        ds.id                = cidadeModel.id;
            if (ds.id) {
                return ds.$update();
            }
                return ds.$save();             				
                 				        
    }
    cidadeFactory.getCidade = function (cidadeId ){
        try {
            var ds = new api.cidade();
        
            return cidadeId ? ds.$get({ id : cidadeId}) : ds.$get();
        } catch (error) {
            console.log(error);    
        }
    }
    cidadeFactory.delete = function(cidadeId){
        var ds = new api.cidade();
        ds.id = cidadeId
        return ds.$delete({id : cidadeId})
    }   
   
    return cidadeFactory;

});