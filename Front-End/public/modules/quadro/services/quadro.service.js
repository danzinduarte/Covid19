angular.module('app.quadro')
.factory('QuadroService', function(api) {
    
    var quadroFactory = {};

    quadroFactory.getAll = function (quadroId){
        var ds = new api.quadro();
        return ds.$get({quadro : quadroId})
    }
    return quadroFactory;

});