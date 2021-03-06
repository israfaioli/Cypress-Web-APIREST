/// <reference types = "cypress"/>

import locators from '../support/locators'
import buildEnv from '../support/buildEnv'
import '../support/commandsContas'

describe('Should test at a functional level', () => {
    after(() => {
        cy.clearLocalStorage()
    })

    before(() => {
        buildEnv()
        cy.loginApplication('a@a', 'senha errada')
    })

    beforeEach(() => {
        buildEnv()
        cy.get(locators.MENU.HOME).click()
    })

    it('Teste para testar responsividade', () => {
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
    })

    it('Teste para criar uma nova conta utilizando mocks', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 }
        }).as('saveConta')

        cy.accessAccountMenu()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
                { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
                { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            ]
        }).as('contasSave')

        cy.createNewAccount('Conta de teste')
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'Conta inserida com sucesso')
    })

    it('Teste de alteração de conta utilizando mocks', () => {
        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response: { id: 1, nome: 'Conta alterada', visivel: true, usuario_id: 1 }
        })

        cy.accessAccountMenu()

        cy.xpath(locators.CONTAS.XP_MODIFY_BUTTON('Banco')).click()
        cy.get(locators.CONTAS.NAME)
            .clear()
            .type('Conta alterada')
        cy.get(locators.CONTAS.SAVE_BUTTON).click()
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'Conta atualizada com sucesso')
    })

    it('Teste exceção ao criar conta com mesmo nome utilizando mocks', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { "error": "Já existe uma conta com esse nome!" },
            status: 400
        }).as('saveContaMesmoNome')

        cy.accessAccountMenu()

        cy.get(locators.CONTAS.NAME).type('teste')
        cy.get(locators.CONTAS.SAVE_BUTTON).click()
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'code 400')
    })

    it('Teste criar uma nova movimentação utilizadando mocks', () => {
        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: { "id": 31433, "descricao": "asdasd", "envolvido": "sdfsdfs", "observacao": null, "tipo": "DESP", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "232.00", "status": false, "conta_id": 42069, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null }
        })

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movements'
        })

        cy.get(locators.MENU.MOVIMENTACAO).click();

        cy.get(locators.MOVIMENTACAO.DESCRIPTION).type('Desc')
        cy.get(locators.MOVIMENTACAO.VALUE).type('123')
        cy.get(locators.MOVIMENTACAO.INTERESTED).type('Inter')
        cy.get(locators.MOVIMENTACAO.CONTA).select('Banco')
        cy.get(locators.MOVIMENTACAO.STATUS).click()
        cy.get(locators.MOVIMENTACAO.SAVE_BUTTON).click()
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'sucesso')

        cy.get(locators.EXTRATO.LINES).should('have.length', 7)
        cy.xpath(locators.EXTRATO.FN_XP_SEARCH_ELEMENT('Desc', '123')).should('exist')
    })

    it('Remover movimentação', () => {
        cy.route({
            method: 'DELETE',
            url: '/transacoes/**',
            response: {},
            status: 204
        }).as('del')

        cy.get(locators.MENU.EXTRATO).click()
        cy.xpath(locators.EXTRATO.FN_XP_REMOVE_ELEMENT('Movimentacao para exclusao')).click()
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'sucesso')
    })

    it('Teste para obter saldo utilizando mocks', () => {
        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 31436,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2019-11-13T03:00:00.000Z",
                "data_pagamento": "2019-11-13T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 42079,
                "usuario_id": 1,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 31436,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2019-11-13T03:00:00.000Z",
                "data_pagamento": "2019-11-13T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 42079,
                "usuario_id": 1,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.get(locators.MENU.HOME).click()
        cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '100,00')

        cy.get(locators.MENU.EXTRATO).click()
        cy.xpath(locators.EXTRATO.FN_XP_UPDATE_ELEMENT('Movimentacao 1, calculo saldo')).click()
        cy.get(locators.MOVIMENTACAO.DESCRIPTION).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(locators.MOVIMENTACAO.STATUS).click()
        cy.get(locators.MOVIMENTACAO.SAVE_BUTTON).click()
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'sucesso')

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [{
                conta_id: 999,
                conta: "Carteira",
                saldo: "4034.00"
            },
            {
                conta_id: 9909,
                conta: "Banco",
                saldo: "10000000.00"
            },
            ]
        }).as('saldoFinal')

        cy.get(locators.MENU.HOME).click()
        cy.get(locators.MENU.HOME).click()
        cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '4.034,00')
    })

    it.skip('Validar os dados no cenário de criar uma conta', () => {
        const reqStub = cy.stub()
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            onRequest: reqStub
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
                { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
                { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            ]
        }).as('contasSave')

        cy.createNewAccount('{CONTROL}')
        cy.wait('@saveConta').then(() => {
            console.log(reqStub.args[0][0])
            expect(reqStub.args[0][0].request.body.nome).to.be.empty
            expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
        })
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'Conta inserida com sucesso')
    })

    it('Should test colors', () => {
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                { "conta": "Conta para movimentacoes", "id": 31434, "descricao": "Receita paga", "envolvido": "AAA", "observacao": null, "tipo": "REC", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 42077, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta com movimentacao", "id": 31435, "descricao": "Receita pendente", "envolvido": "BBB", "observacao": null, "tipo": "REC", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1500.00", "status": false, "conta_id": 42078, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 31436, "descricao": "Despesa paga", "envolvido": "CCC", "observacao": null, "tipo": "DESP", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "3500.00", "status": true, "conta_id": 42079, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 31437, "descricao": "Despesa pendente", "envolvido": "DDD", "observacao": null, "tipo": "DESP", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1000.00", "status": false, "conta_id": 42079, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null }
            ]
        })

        cy.get(locators.MENU.EXTRATO).click()
        cy.xpath(locators.EXTRATO.FN_XP_LINE('Receita paga')).should('have.class', 'receitaPaga')
        cy.xpath(locators.EXTRATO.FN_XP_LINE('Receita pendente')).should('have.class', 'receitaPendente')
        cy.xpath(locators.EXTRATO.FN_XP_LINE('Despesa paga')).should('have.class', 'despesaPaga')
        cy.xpath(locators.EXTRATO.FN_XP_LINE('Despesa pendente')).should('have.class', 'despesaPendente')
    })


})