angular.module('app.pessoa')
.controller('PessoaController', PessoaController);

function PessoaController(PessoaService,$mdDialog, $state)
{
    vm = this;
    vm.carregaPessoas  = carregaPessoas;
    vm.novaPessoa      = novaPessoa;
    vm.editaPessoa     = editaPessoa;
    vm.excluiPessoa    = excluiPessoa;
    vm.excluir         = excluir;
    vm.voltar          = voltar;
   


    function init(){
        carregaPessoas()
    }
    init ()      
     
    function carregaPessoas(){
        PessoaService.getAll().then(function(pessoa){
            vm.dataset = pessoa.data
            nomeSituacao(pessoa.data)
        })
    } 
    function novaPessoa(){
		$state.go('pessoa-novo')	
    }
    function editaPessoa(pessoaId) {
		$state.go('pessoa-edita', {id : pessoaId})		
    }
    function voltar() {
        $state.go('home')
    }
    function excluiPessoa(ev,pessoas){
		
        let confirmacao = $mdDialog.confirm()
                .title('Aguardando confirmação')
                .textContent('Confirma a exclusao da pessoa ' + pessoas.nome)
                .ariaLabel('Msg interna do botao')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');

        $mdDialog.show(confirmacao).then(function() {
                vm.excluir(pessoas.id)
        });
    }
    
    function excluir(pessoaId){
        let sucesso = function(resposta){			
            if (resposta.sucesso) {
                toastr.info('Pessoa excluido com sucesso :)');
            }
            carregaPessoas();
        }

        let erro = function(resposta){	
            toastr.warning("Ocorreu um erro ao excluir a pessoa!")
            $state.go('pessoa')	
        }

        PessoaService.delete(pessoaId).then(sucesso,erro) 
    }
    function nomeSituacao(dsPessoa){
        vm.dataset = dsPessoa.map(function(resp){

            switch (resp.situacao) {
				case 1:
					resp.situacao = "Caso Suspeito";
					
					break;
				case 2:
					resp.situacao = "Caso em Analise"
					
					break;    
				case 3:
					resp.situacao = "Caso Confirmado"
					break;
				case 4:
					resp.situacao = "Caso Descartado"
					break;     
				default:
					break;
			}
			return resp
        })
    }
}