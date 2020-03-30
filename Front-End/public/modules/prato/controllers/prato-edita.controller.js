angular.module('app.prato')
.controller('PratoEditaController', PratoEditaController);

function PratoEditaController(PratoService, RestauranteService, $state, pratoId)
{
    vm              = this;
    vm.salvaPrato   = salvaPrato;
    vm.cancelar     = cancelar;
    vm.carregaRestaurantes  = carregaRestaurantes ;
    vm.restauranteService = RestauranteService;

    function init(){
        if (pratoId) {
            PratoService.getById(pratoId).then(function(pratoModel){
                vm.dataset = pratoModel.data
            })
        }

        carregaRestaurantes();
	}

    init()
        
    function salvaPrato() {

        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 
        var pratoModel = {},
            prato = {
                nomeDoPrato   : vm.dataset.nomeDoPrato,
                preco         : vm.dataset.preco,
                restauranteId : vm.dataset.restaurante.id
            }
        pratoModel               = prato;
        pratoModel.id            = pratoId;

        PratoService.save(pratoModel)
        .then(function(resposta) 
        {
            if (resposta.sucesso) 
            {               
                toastr.info("Prato atualizado com êxito :)","SUCESSO")  
                }
                else 
                {
                    toastr.success("Prato incluído com êxito :)","SUCESSO")
                }
                $state.go('prato')
            
        })
        .catch(function(error){
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
        })
    }
    function carregaRestaurantes(restauranteId = null) {
        return vm.restauranteService.getRestaurante(restauranteId)
        .then(function(restauranteModel){
        	vm.dsRestaurante = restauranteModel.data;
       			return restauranteModel.data
        })
        .catch(error => {
            console.log(error);
        })
    } 
    function cancelar() {
        $state.go('prato')
    }
}