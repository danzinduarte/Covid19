angular.module('app.pessoa')
    .controller('PessoaListaController', PessoaListaController);


function PessoaListaController(PessoaService, pessoaId, CidadeService, ProntuarioService, $mdDialog, $state) {
    vm = this;
    vm.dataset = {}
    vm.cancelar = cancelar;
    vm.carregaCidades = carregaCidades;
    vm.cidadeService = CidadeService;
    vm.carregaProntuarios = carregaProntuarios;
    vm.prontuarioService = ProntuarioService;
    vm.excluiPessoa = excluiPessoa;
    vm.excluir = excluir;
    vm.editaPessoa = editaPessoa;
    vm.nomeSituacao = nomeSituacao;
    vm.prontuario = prontuario;



    function init() {

        if (pessoaId) {
            PessoaService.getById(pessoaId).then(function (pessoaModel) {
                vm.dataset = pessoaModel.data
            })
        }
        carregaCidades();
        carregaProntuarios();
    }

    init()


    function carregaCidades(cidadeId) {
        return vm.cidadeService.getCidade(cidadeId)
            .then(function (cidadeModel) {
                vm.dsCidade = cidadeModel.data;
                return cidadeModel.data

            })
    }
    function carregaProntuarios(prontuarioId = pessoaId) {
        return vm.prontuarioService.getById(prontuarioId)
            .then(function (prontuarioModel) {
                vm.dsProntuario = prontuarioModel.data;
                nomeSituacao(prontuarioModel.data)
            })
    }

    function cancelar() {
        $state.go('pessoa')
    }
    function prontuario() {
        $state.go('prontuario')
    }
    function excluiPessoa(ev) {

        let confirmacao = $mdDialog.confirm()
            .title('Aguardando confirmação')
            .textContent('Confirma a exclusao do(a) ' + vm.dataset.nome)
            .ariaLabel('Msg interna do botao')
            .targetEvent(ev)
            .ok('Sim')
            .cancel('Não');

        $mdDialog.show(confirmacao).then(function () {
            vm.excluir(pessoaId)
        });
    }

    function excluir(pessoaId) {
        let sucesso = function (resposta) {
            if (resposta.sucesso) {
                toastr.info('Pessoa excluida com sucesso :)');
            }
            $state.go('pessoa')
        }

        let erro = function (resposta) {
            toastr.warning("Ocorreu um erro ao excluir a pessoa!")
            $state.go('pessoa')
        }

        PessoaService.delete(pessoaId).then(sucesso, erro)
    }
    function editaPessoa(pessoaId) {
        $state.go('pessoa-edita', { id: vm.dataset.id })
    }
    function nomeSituacao(dsProntuario) {
        vm.dsProntuario = dsProntuario.map(function (resp) {
            if (resp.situacao == 1) {
                resp.situacao = "Caso Suspeito"
            }
            else if (resp.situacao == 2) {
                resp.situacao = "Caso em Analise"
            }
            else if (resp.situacao == 3) {
                resp.situacao = "Caso Confirmado"
            }
            else if (resp.situacao == 4) {
                resp.situacao = "Caso Descartado"
            }

            return resp
        })
    }
}