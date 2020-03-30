(function ()
{
    'use strict';

    angular
        .module('materialApp')
        .factory('api', apiService);
    
    function apiService($resource)
    {

      var api = {}      

      // Base Url
      api.baseUrl = 'http://localhost:5000/api/';

      api.cidade = $resource(api.baseUrl + 'cidade/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
      })
      api.quadro = $resource(api.baseUrl + 'quadro/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
      })
      return api;
    }

})();
