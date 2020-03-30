angular.module('app.quadro')
.controller('QuadroController', QuadroController);

function QuadroController(QuadroService)
{
    vm = this;
    vm.carregaQuadros  = carregaQuadros;

    function init(){
        carregaQuadros()
    }
    init ()         

    function carregaQuadros(){
        QuadroService.getAll().then(function(quadros){
            vm.dataset = quadros.data
            return vm.dataset
           
        })
    } 
}