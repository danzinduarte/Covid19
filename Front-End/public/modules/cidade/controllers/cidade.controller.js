angular.module('app.cidade')
    .controller('CidadeController', CidadeController);

function CidadeController(CidadeService, $mdDialog, $state, $scope) {
    vm = this;
    vm.carregaCidades = carregaCidades;
    vm.novaCidade = novaCidade;
    vm.editaCidade = editaCidade;
    vm.listaCidade = listaCidade;
    vm.voltar = voltar;
    vm.avancar = avancar;
    vm.retornar = retornar;
    vm.buscaCidade = buscaCidade;


    function init() {
        carregaCidades()
    }
    init()

    function carregaCidades() {
        coluna = 0
        CidadeService.getAll().then(function (cidade) {
            vm.dataset = cidade.data
            return vm.dataset
        })
    }
    function novaCidade() {
        $state.go('cidade-novo')
    }
    function editaCidade(cidadeId) {
        $state.go('cidade-edita', { id: cidadeId })
    }
    function listaCidade(cidadeId) {
        $state.go('cidade-lista', { id: cidadeId })
    }
    function voltar() {
        $state.go('quadro')
    }


    function avancar() {
        coluna += 10
        vm.index += 1
        cidadeService.getAll(coluna).then(function (dados) {
            vm.dataset = dados.data
            return vm.dataset
        })
    }
    function retornar() {
        coluna -= 10
        vm.index -= 1
        if (coluna < 0) {
            coluna = 0
            vm.index = 0
        }
        cidadeService.getAll(coluna).then(function (dados) {
            vm.dataset = dados.data
            return vm.dataset
        })
    }
    function buscaCidade(cidade) {
        if (coluna < 0) {
            coluna = 0
        }
        coluna += 10

        cidadeService.getCidade(cidade, coluna).then(function (dados) {
            vm.dataset = dados.data
            return vm.dataset
        })
    }
}