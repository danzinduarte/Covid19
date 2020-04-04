angular.module('app.pessoa')
.controller('PessoaEditaController', PessoaEditaController);

function PessoaEditaController(PessoaService, pessoaId, CidadeService, $mdDialog, $state)
{
    vm = this;
    vm.dataset = {}
    vm.salvaPessoa          = salvaPessoa;
    vm.cancelar             = cancelar;
    vm.carregaCidades       = carregaCidades;
    vm.cidadeService        = CidadeService;
    vm.excluiPessoa         = excluiPessoa;
    vm.excluir              = excluir;
    
    function init(){

        if (pessoaId) {
            PessoaService.getById(pessoaId).then(function(pessoaModel){
                vm.dataset = pessoaModel.data
                console.log(vm.dataset)
            })
        }
        carregaCidades();
	}

    init()	

    function salvaPessoa() 
    {
        vm.dataset.situacao = 1;
        if (vm.form.$invalid) 
        {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 

       var pessoaModel = {},
       
       pessoa = {
           nome              : vm.dataset.nome,
           data_nascimento   : moment(vm.dataset.data_nascimento).format('L'),
           cidade_id         : vm.dataset.cidade.id,
           situacao          : vm.dataset.situacao
       }
       
        
       pessoaModel = pessoa; 
       pessoaModel.id = pessoaId
        
       PessoaService.save(pessoaModel)
       .then(function(resposta) 
       {
           if (resposta.sucesso = true) 
           {	
               if (pessoaId) 
               {
                   toastr.info("Pessoa atualizada com êxito :)","SUCESSO")
               }
               else 
               {
                   toastr.success("Pessoa incluída com êxito :)","SUCESSO")
               }
               $state.go('pessoa')
           }
       })
       .catch(function(error){
           toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
       })
   }
    function carregaCidades(cidadeId = null) {
        return vm.cidadeService.getCidade(cidadeId)
        .then(function(cidadeModel){
        	vm.dsCidade = cidadeModel.data;
       			return cidadeModel.data
        })
        .catch(error => {
            console.log(error);
        })
    } 
    function cancelar() {
        $state.go('pessoa')
    }
    function excluiPessoa(ev){
		
        let confirmacao = $mdDialog.confirm()
                .title('Aguardando confirmação')
                .textContent('Confirma a exclusao do(a) ' + vm.dataset.nome)
                .ariaLabel('Msg interna do botao')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');

        $mdDialog.show(confirmacao).then(function() {
                vm.excluir(pessoaId)
        });
    }
    
    function excluir(pessoaId){
        let sucesso = function(resposta){			
            if (resposta.sucesso) {
                toastr.info('Pessoa excluido com sucesso :)');
            }
            $state.go('pessoa')
        }

        let erro = function(resposta){	
            toastr.warning("Ocorreu um erro ao excluir a pessoa!")
            $state.go('pessoa')	
        }

        PessoaService.delete(pessoaId).then(sucesso,erro) 
    }
}