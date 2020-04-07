var materialApp = angular
.module('materialApp', [
    'materialApp.routes',
    'ui.router',
    'ngMaterial',
    'ngResource',
    'ngMessages',
    'appCtrl',
    'ngStorage',
    'app.quadro',
    'app.cidade',
    'app.pessoa',
    'app.prontuario'
    

]).config(function($mdThemingProvider,$mdDateLocaleProvider,$mdAriaProvider,$httpProvider) {
  
    $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('red');

    // Formata de data brasileiro
    $mdDateLocaleProvider.formatDate = function(date) {
        return date ? moment(date).format('DD/MM/YYYY') : null;
    };

    // Desativar os warnings de ARIA-LABEL (label para tecnologias assistivas)
    $mdAriaProvider.disableWarnings(); 


    /// Interceptador de requisicoes
    $httpProvider.interceptors.push(function($q, $injector, $localStorage) {
        return {
          'request': function (config) {
            config.headers = config.headers || {};
            return config;
          },
          'responseError': function(response) {
            switch (response.status) {
              case 401:
                break;                

              default :
                return $q.reject(response);
            }
          }
        };
      })

    
});