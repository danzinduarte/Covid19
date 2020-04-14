(function () {
    'use strict';

    angular
    angular.module('app.prontuario', [])
        .config(config);

    function config($stateProvider) {
        // State
        $stateProvider
        .state('prontuario', {
            url: '/prontuario',
            templateUrl: '/modules/pessoa/views/prontuario.html',
            controller: 'ProntuarioController',
            controllerAs: 'vm',
            params: {
                title: "Prontuario Pessoa",
            }
        })
    }
})()