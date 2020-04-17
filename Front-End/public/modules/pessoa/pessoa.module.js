(function () {
    'use strict';

    angular
    angular.module('app.pessoa', [])
        .config(config);

    function config($stateProvider) {
        // State
        $stateProvider

            .state('pessoa-novo', {
                url: '/pessoa-novo',
                templateUrl: './modules/pessoa/views/pessoa-novo.html',
                controller: 'PessoaEditaController',
                controllerAs: 'vm',
                params: {
                    title: "Nova pessoa"
                },
                resolve: {
                    pessoaId: function ($stateParams) {
                        return $stateParams.id;
                    }
                }
            })
            .state('pessoa', {
                url: '/pessoa',
                templateUrl: './modules/pessoa/views/pessoa.html',
                controller: 'PessoaController',
                controllerAs: 'vm',
                params: {
                    title: "Cadastro de Pessoa",

                }
            })
            .state('pessoa-edita', {
                url: '/pessoa-edita/:id',
                templateUrl: '/modules/pessoa/views/pessoa-edita.html',
                controller: 'PessoaEditaController',
                controllerAs: 'vm',
                params: {
                    title: "Editar Pessoa",
                },
                resolve: {
                    pessoaId: function ($stateParams) {
                        return $stateParams.id;
                    }
                }
            })
            .state('pessoa-lista', {
                url: '/pessoa-lista/:id',
                templateUrl: '/modules/pessoa/views/pessoa-lista.html',
                controller: 'PessoaListaController',
                controllerAs: 'vm',
                params: {
                    title: "Visualizar Pessoa",
                },
                resolve: {
                    pessoaId: function ($stateParams) {
                        return $stateParams.id;
                    }
                }
            })
            .state('pessoa-prontuario', {
                url: '/pessoa-prontuario/:id',
                templateUrl: '/modules/pessoa/views/pessoa-prontuario.html',
                controller: 'PessoaListaController',
                controllerAs: 'vm',
                params: {
                    title: "Visualizar Pessoa",
                },
                resolve: {
                    pessoaId: function ($stateParams) {
                        return $stateParams.id;
                    }
                }
            })

    }
})()