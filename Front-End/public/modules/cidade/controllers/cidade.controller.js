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
    vm.openDialog      = openDialog;
 


    function init(){
        carregaCidades()
    }
    init ()      
     
    function openDialog($event) {
        $mdDialog.show({
          controller: 'CidadeEditaController',
          controllerAs: 'vm',
          templateUrl: './modules/cidade/views/cidade-novo.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose:false
        });
      };

    function carregaCidades(){
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
    function excluiCidade(ev,cidades){
		
        let confirmacao = $mdDialog.confirm()
                .title('Aguardando confirmação')
                .textContent('Confirma a exclusao da cidade ' + cidades.nome)
                .ariaLabel('Msg interna do botao')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');

        $mdDialog.show(confirmacao).then(function() {
                vm.excluir(cidades.id)
        });
    }
    
    function excluir(cidadeId){
        let sucesso = function(resposta){			
            if (resposta.sucesso) {
                toastr.info('Cidade excluido com sucesso :)');
            }
            carregaCidades();
        }

        let erro = function(resposta){	
            toastr.warning("Ocorreu um erro ao excluir a cidade!")
            $state.go('cidade')	
        }

        CidadeService.delete(cidadeId).then(sucesso,erro) 
    }
}