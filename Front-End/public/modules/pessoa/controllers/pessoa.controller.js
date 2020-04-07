angular.module('app.pessoa')
.controller('PessoaController', PessoaController);

function PessoaController(PessoaService,$mdDialog, $state)
{
    vm = this;
    vm.carregaPessoas  = carregaPessoas;
    vm.novaPessoa      = novaPessoa;
    vm.editaPessoa     = editaPessoa;
    vm.voltar          = voltar;
    vm.listaPessoa     = listaPessoa;
   


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
    function listaPessoa(pessoaId) {
		$state.go('pessoa-lista', {id : pessoaId})		
    }
    function voltar() {
        $state.go('home')
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