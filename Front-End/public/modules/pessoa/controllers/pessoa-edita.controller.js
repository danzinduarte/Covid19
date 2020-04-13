angular.module('app.pessoa')
    .controller('PessoaEditaController', PessoaEditaController);

function PessoaEditaController(PessoaService, pessoaId, CidadeService, $mdDialog, $state) {
    vm = this;
    vm.dataset = {}
    vm.salvaPessoa = salvaPessoa;
    vm.cancelar = cancelar;
    vm.carregaCidades = carregaCidades;
    vm.cidadeService = CidadeService;
    vm.prontuario = prontuario;


    function init() {

        if (pessoaId) {
            PessoaService.getById(pessoaId).then(function (pessoaModel) {
                vm.dataset = pessoaModel.data
                console.log(pessoaModel.datan)
            })
        }
        carregaCidades();
    }

    init()

    function salvaPessoa() {
        vm.dataset.situacao = 1;
        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.", "ERRO")
            return
        }

        var pessoaModel = {},

            pessoa = {
                nome: vm.dataset.nome,
                data_nascimento: vm.dataset.data_nascimento,
                cidade_id: vm.dataset.cidade.id,
                situacao: vm.dataset.situacao
            }


        pessoaModel = pessoa;
        pessoaModel.id = pessoaId

        PessoaService.save(pessoaModel)
            .then(function (resposta) {
                if (resposta.sucesso = true) {
                    if (pessoaId) {
                        toastr.info("Pessoa atualizada com êxito :)", "SUCESSO")
                    }
                    else {
                        toastr.success("Pessoa incluída com êxito :)", "SUCESSO")
                    }
                    $state.go('pessoa')
                }
            })
            .catch(function (error) {
                toastr.error("Erro! Revise seus dados e tente novamente.", "ERRO")
            })
    }
    function carregaCidades(cidadeId = null) {
        return vm.cidadeService.getCidade(cidadeId)
            .then(function (cidadeModel) {
                vm.dsCidade = cidadeModel.data;
                return cidadeModel.data
            })
    }
    function cancelar() {
        $state.go('pessoa')
    }
    function prontuario() {
        $state.go('pessoa-prontuario')
    }

}