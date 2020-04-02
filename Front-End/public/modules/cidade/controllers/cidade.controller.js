angular.module('app.cidade')
.controller('CidadeController', CidadeController);

function CidadeController(CidadeService,$mdDialog, $state, $scope)
{
    vm = this;
    vm.carregaCidades  = carregaCidades;
    vm.novaCidade      = novaCidade;
    vm.editaCidade     = editaCidade;
    vm.excluiCidade    = excluiCidade;
    vm.excluir         = excluir;
    vm.voltar          = voltar;
    vm.avancar         = avancar;
    vm.retornar        = retornar;
    vm.buscaCidade     = buscaCidade;
    vm.CidadeById      = CidadeById;
    
    function init(){
            carregaCidades()
    }
    init ()          

    function carregaCidades(){
        coluna = 0
        CidadeService.getAll().then(function(cidade){
            vm.dataset = cidade.data
            return vm.dataset
        })
    } 
    function novaCidade(){
		$state.go('cidade-novo')	
    }
    function editaCidade(cidadeId) {
		$state.go('cidade-edita', {id : cidadeId})		
    }
    function voltar() {
        $state.go('home')
    }
    function excluiCidade(ev){
		
        let confirmacao = $mdDialog.confirm()
                .title('Aguardando confirmação')
                .textContent('Confirma a exclusao da cidade de ' + vm.dataset.nome)
                .ariaLabel('Msg interna do botao')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');

        $mdDialog.show(confirmacao).then(function() {
                vm.excluir(cidadeId)
        });
    }
    
    function excluir(cidadeId){
        let sucesso = function(resposta){			
            if (resposta.sucesso) {
                toastr.info('Cidade excluido com sucesso :)');
            }
            $state.go('cidade')
        }

        let erro = function(resposta){	
            toastr.warning("Ocorreu um erro ao excluir a cidade!")
            $state.go('cidade')	
        }

        CidadeService.delete(cidadeId).then(sucesso,erro) 
    }
    
    $scope.abrirJanela = function($event, cidadeId) {
        $mdDialog.show({
          controller: 'CidadeEditaController',
          controllerAs: 'vm',
          url: '/cidade-lista/:id',
          templateUrl: './modules/cidade/views/cidade-lista.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          params: {
            title: "Ver Cidade",
        },
          clickOutsideToClose:true,
          resolve : {
            cidadeId : function($stateParams){
                  console.log('Modulo: ' + $stateParams.id)
                  return $stateParams.id;
              }    
          }
        });
        CidadeById(cidadeId)  
    };        
      function avancar() {
        coluna += 10
        vm.index += 1
        cidadeService.getAll(coluna).then(function(dados) {
            vm.dataset =  dados.data
            return vm.dataset
       })
    }
    function retornar() {
        coluna      -= 10
        vm.index    -= 1
        if (coluna < 0) {
            coluna      = 0
            vm.index    = 0
        }
        cidadeService.getAll(coluna).then(function(dados) {
            vm.dataset =  dados.data
            return vm.dataset
       })
    }
    function buscaCidade(cidade) {
        if (coluna < 0) {
            coluna = 0
        }
        coluna += 10 

        cidadeService.getCidade(cidade,coluna).then(function(dados) {
            vm.dataset = dados.data
            return vm.dataset
        })
    }
    function CidadeById(cidadeId){
        CidadeService.getById(cidadeId).then(function(cidadeModel){
            vm.dataset = cidadeModel.data
        })
    }
}