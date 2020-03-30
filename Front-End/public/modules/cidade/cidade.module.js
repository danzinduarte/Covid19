(function ()
{
  'use strict';

  angular
    angular.module('app.cidade', [])
    .config(config);
  
  function config($stateProvider)
  {
    // State
    $stateProvider

    .state('cidade-novo', {
        url: '/cidade-novo',
        templateUrl: './modules/cidade/views/cidade-novo.html',
        controller: 'CidadeEditaController',
        controllerAs: 'vm',
        params: {
            title: "Nova cidade"
        },
        resolve : {
            cidadeId : function($stateParams){
                console.log('Modulo: ' + $stateParams.id)
                return $stateParams.id;
            }    
        }
    })
    .state('cidade', {
        url: '/cidade',
        templateUrl: './modules/cidade/views/cidade.html',
        controller: 'CidadeController',
        controllerAs: 'vm',
        params: {
            title: "Cadastro de Cidade",
            
        }
    })
    .state('cidade-edita', {
      url: '/cidade-edita/:id',
      templateUrl: '/modules/cidade/views/cidade-edita.html',
      controller: 'CidadeEditaController',
      controllerAs: 'vm',
      params: {
          title: "Editar Cidade",
      },
      resolve : {
        cidadeId : function($stateParams){
              console.log('Modulo: ' + $stateParams.id)
              return $stateParams.id;
          }    
      }
  })
  }  
})()