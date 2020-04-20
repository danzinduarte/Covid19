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
        //Ta pegadno apenas a primeiro pessoas porque nesse método, tu não passou o parâmetro que no caso é o ID
        // o response.data[0] pega o primeirodado dentro do array,
        // Passe o id e removaesse [0] é pra fazer oque ? eu escrevi por cima
        const response = await vm.pessoaService.getPessoa();

        /*vm.dsPessoa é um objeto, mas a ap retorna um array */
        vm.dsPessoa = response.data;
        
        console.log(vm.dsPessoa)
    }
    
    function salvaProntuario() {//olha o whats
        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.", "ERRO")
            return
        }

        var prontuarioModel = {},

            prontuario = {
                pessoa_id:  pessoaModel.data.id,
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