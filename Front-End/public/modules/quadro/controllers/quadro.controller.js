angular.module('app.quadro')
    .controller('QuadroController', QuadroController);

function QuadroController(QuadroService, $state) {
    vm = this;
    vm.carregaQuadros = carregaQuadros;
    vm.cidade = cidade;
    vm.pessoa = pessoa;
    function init() {
        carregaQuadros()
    }
    init()

    function carregaQuadros() {
        QuadroService.getAll().then(function (quadros) {
            vm.dataset = quadros.data
            return vm.dataset

        })
    }
    function cidade() {
        $state.go('cidade')
    }

    function pessoa() {
        $state.go('pessoa')
    }

}