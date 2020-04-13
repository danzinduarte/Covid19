(function () {
  'use strict';

  angular
  angular.module('app.quadro', [])
    .config(config);

  function config($stateProvider) {
    // State
    $stateProvider

      .state('quadro', {
        url: '/quadro',
        templateUrl: './modules/quadro/views/quadro.html',
        controller: 'QuadroController',
        controllerAs: 'vm',
        params: {
          title: "Quadro Geral "
        }
      })
  }
})()