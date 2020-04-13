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
                templateUrl: './modules/prontuario/views/prontuario.html',
                controller: 'ProntuarioController',
                controllerAs: 'vm',
                params: {
                    title: "Lista de Prontuarios",

                }
            })
    }
})()