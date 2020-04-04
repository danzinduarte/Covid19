angular.module('app.cidade')
.controller('CidadeEditaController', CidadeEditaController);

function CidadeEditaController(CidadeService, cidadeId, $state,$mdDialog )
{
    vm = this;
    vm.dataset = {}
    vm.salvaCidade         = salvaCidade;
    vm.cancelar            = cancelar;
    vm.excluiCidade        = excluiCidade;
    vm.excluir             = excluir; 
    vm.estados              = ('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO').split(' ').map(function (estado) { return { abbrev: estado }; });
    function init(){

        if (cidadeId) {
           
            CidadeService.getById(cidadeId).then(function(cidadeModel){
                vm.dataset = cidadeModel.data
                
            })
        }
	}

    init()	

    function salvaCidade() 
    {
        if (vm.form.$invalid) 
        {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 

       var cidadeModel = {},
       cidade = {
           nome : vm.dataset.nome,
           uf   : vm.dataset.uf
       }
        
       cidadeModel = cidade; 
       cidadeModel.id = cidadeId
        
       CidadeService.save(cidadeModel)
        .then(function(resposta) 
        {
            if (resposta.sucesso) 
            {	
                if (cidadeId) 
                {
                    toastr.info("Cidade atualizada com êxito :)","SUCESSO")
                }
                else 
                {
                    toastr.success("Cidade incluída com êxito :)","SUCESSO")
                }
                $state.go('cidade')
            }
        })
        .catch(function(error){
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
        })
    }
    function cancelar() {
        $state.go('cidade')
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
}