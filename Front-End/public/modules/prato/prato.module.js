(function ()
{
  'use strict';

  angular
    angular.module('app.prato', [])
    .config(config);
  
  function config($stateProvider)
  {
    // State
    $stateProvider

    .state('prato-novo', {
        url: '/prato-novo',
        templateUrl: './modules/prato/views/prato-novo.html',
        controller: 'PratoEditaController',
        controllerAs: 'vm',
        params: {
            title: "Novo Prato"
        },
        resolve : {
            pratoId : function($stateParams){
                console.log('Modulo: ' + $stateParams.id)
                return $stateParams.id;
            }    
        }
    })
    .state('prato', {
        url: '/prato',
        templateUrl: './modules/prato/views/prato.html',
        controller: 'PratoController',
        controllerAs: 'vm',
        params: {
            title: "Cadastro de Pratos"
        }
    })
    .state('prato-edita', {
      url: '/prato-editar/:id',
      templateUrl: './modules/prato/views/prato-edita.html',
      controller: 'PratoEditaController',
      controllerAs: 'vm',
      params: {
          title: "Editar Prato"
      },
      resolve : {
        pratoId : function($stateParams){
              console.log('Modulo: ' + $stateParams.id)
              return $stateParams.id;
        }
      }
  })
  }  
})()