angular.module('app.prontuario')
    .controller('ProntuarioController', ProntuarioController);

function ProntuarioController(ProntuarioService, PessoaService, $state, $mdDialog) {
    vm = this;
    vm.salvaProntuario      = salvaProntuario;
    vm.cancelar             = cancelar;
    vm.carregaPessoas       = carregaPessoas;
    vm.pessoaService        = PessoaService;
    vm.estados = ('Caso_Confirmado Caso_Suspeito Caso_em_Análise Caso_Descartado').split(' ').map(function (estado) { return { abbrev: estado }; });
   


    function init() {
        carregaPessoas()
    }
    init()
    
    async function carregaPessoas(){
       
        const response = await vm.pessoaService.getPessoa();
        vm.dsPessoa = response.data;
    }
    
    function salvaProntuario() {//olha o whats
        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.", "ERRO")
            return
        }

        var prontuarioModel = {},

            prontuario = {
                pessoa_id:  vm.dsPessoa.id,
                situacao:   vm.dataset.situacao,
                data_hora:  Date.now()
            }


        prontuarioModel = prontuario;
        prontuarioModel.id = prontuarioId

        ProntuarioService.save(prontuarioModel)
            .then(function (resposta) {
                if (resposta.sucesso = true) {
                    if (prontuarioId) {
                        toastr.info("Prontuario atualizado com êxito :)", "SUCESSO")
                    }
                    else {
                        toastr.success("Prontuario incluído com êxito :)", "SUCESSO")
                    }
                    $state.go('pessoa')
                }
            })
            .catch(function (error) {
                toastr.error("Erro! Revise seus dados e tente novamente.", "ERRO")
            })
    }
  
    function cancelar() {
        $state.go('pessoa')
    }

}