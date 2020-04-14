angular.module('app.prontuario')
    .controller('ProntuarioController', ProntuarioController);

function ProntuarioController(ProntuarioService, PessoaService, prontuarioId, $mdDialog, $state) {
    vm = this;
    vm.dataset = {}
    vm.salvaProntuario = salvaProntuario;
    vm.cancelar = cancelar;
    vm.carregaPessoas = carregaPessoas;
    vm.pessoaService = PessoaService;


    function init() {

        if (prontuarioId) {
            ProntuarioService.getById(prontuarioId).then(function (prontuarioModel) {
                vm.dataset = prontuarioModel.data
            })
        }
        carregaPessoas();
    }

    init()

    function salvaProntuario() {
        vm.dataset.situacao = 1;
        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.", "ERRO")
            return
        }

        var prontuarioModel = {},

            prontuario = {
                pessoa_id: vm.dataset.pessoa_id,
                situacao: vm.dataset.situacao,
                data_hora: Date.now()
            }


        prontuarioModel = prontuario;
        prontuarioModel.id = prontuarioId

        ProntuarioService.save(prontuarioModel)
            .then(function (resposta) {
                if (resposta.sucesso = true) {
                    if (prontuarioId) {
                        toastr.info("Prontuario atualizada com êxito :)", "SUCESSO")
                    }
                    else {
                        toastr.success("Prontuario incluída com êxito :)", "SUCESSO")
                    }
                    $state.go('pessoa')
                }
            })
            .catch(function (error) {
                toastr.error("Erro! Revise seus dados e tente novamente.", "ERRO")
            })
    }
    function carregaPessoas(pessoaId = null) {
        return vm.pessoaService.getPessoa(pessoaId)
            .then(function (pessoaModel) {
                vm.dsPessoa = pessoaModel.data;
                return pessoaModel.data
            })
    }
    function cancelar() {
        $state.go('pessoa')
    }

}