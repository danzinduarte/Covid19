angular.module('app.cidade')
.controller('CidadeEditaController', CidadeEditaController);

function CidadeEditaController(CidadeService, cidadeId, $state)
{
    vm = this;
    vm.dataset = {}
    vm.salvaCidade         = salvaCidade;
    vm.cancelar            = cancelar;
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
}