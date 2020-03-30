angular.module('app.prato')
.factory('PratoService', function(api) {
    
    var pratoFactory = {};

    pratoFactory.getAll = function (pratoId){
        var ds = new api.prato();
        return ds.$get({prato : pratoId})
    }
    pratoFactory.getById =function(pratoId) {
        var ds      = new api.prato();
        ds.id   = pratoId;
        return ds.$get();
    }
    
    pratoFactory.delete = function(pratoId){
        var ds = new api.prato();
        ds.id = pratoId
        return ds.$delete({id : pratoId})
    }
    pratoFactory.save = function(pratoModel){
        var ds                                   = new api.prato();
            ds.nomeDoPrato                       = pratoModel.nomeDoPrato;
            ds.preco                             = pratoModel.preco;
            ds.id                                = pratoModel.id;
            ds.restauranteId                     = pratoModel.restauranteId;
            if (ds.id) {
                return ds.$update();
            }
                return ds.$save();                				
                 				        
    }
    pratoFactory.getRestaurante = function (nomeDoRestaurante){
        var ds = new api.restaurante();
        return ds.$get({ restauranteModel : nomeDoRestaurante});
    }
    return pratoFactory;

});