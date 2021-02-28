/// <reference types = "cypress"/>

import locators from '../support/locators'
import '../support/commandsContas'

describe('Testes automatizados end to end para portfólio', () => {
    before(() => {
        cy.visitUrl('http://barrigareact.wcaquino.me')
        cy.loginApplication()
        cy.resetApplication()
    })

    beforeEach(() => {
        cy.get(locators.MENU.HOME).click()
        cy.resetApplication()
    })

    it('inserir uma conta', () => {
        cy.accessAccountMenu()
        cy.createNewAccount('conta automação 02')
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'Conta inserida com sucesso!')

    })

    it('alterar conta', () => {
        cy.accessAccountMenu()
        cy.xpath(locators.CONTAS.XP_MODIFY_BUTTON('Conta para alterar')).click()
        cy.get(locators.CONTAS.NAME).clear().type('Conta para alterar automação')
        cy.get(locators.CONTAS.SAVE_BUTTON).click()
        cy.assertMessageContainer('Conta atualizada com sucesso!')
    })

    it('inserir conta de mesmo nome', () => {
        cy.accessAccountMenu()
        cy.createNewAccount('Conta mesmo nome')
        cy.get(locators.MESSAGE_CONTAINER).should('contain', 'Erro: Error: Request failed with status code 400')
    })

    it('criar uma nova movimentação', () => {
        cy.get(locators.MENU.MOVIMENTACAO).click()
        cy.get(locators.MOVIMENTACAO.DESCRIPTION).type('Desc')
        cy.get(locators.MOVIMENTACAO.VALUE).type('123')
        cy.get(locators.MOVIMENTACAO.INTERESTED).type('Interessado')
        cy.get(locators.MOVIMENTACAO.STATUS).click()
        cy.get(locators.MOVIMENTACAO.CONTA).select('Conta para alterar')
        cy.get(locators.MOVIMENTACAO.SAVE_BUTTON).click()
        cy.assertMessageContainer('sucesso')
        cy.get(locators.EXTRATO.LINES).should('have.length', 7)
        cy.xpath(locators.EXTRATO.FN_XP_SEARCH_ELEMENT('Desc', '123')).should('exist')
    })

    it('remover uma transação', () => {
        cy.get(locators.MENU.EXTRATO).click()
        cy.xpath(locators.EXTRATO.FN_XP_REMOVE_ELEMENT('Movimentacao para exclusao')).click()
        cy.assertMessageContainer('sucesso')
    })

    it('obter o saldo', () => {
        cy.get(locators.MENU.HOME).click()
        cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00')

        cy.get(locators.MENU.EXTRATO).click()
        cy.xpath(locators.EXTRATO.FN_XP_UPDATE_ELEMENT('Movimentacao 1, calculo saldo')).click()

        cy.get(locators.MOVIMENTACAO.DESCRIPTION).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(locators.MOVIMENTACAO.VALUE).should('have.value', '3500.00')
        cy.get(locators.MOVIMENTACAO.STATUS).click()
        cy.get(locators.MOVIMENTACAO.SAVE_BUTTON).click()
        cy.assertMessageContainer('sucesso')
        cy.get(locators.MENU.MOVIMENTACAO).click()
        cy.get(locators.MENU.HOME).click()
        cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')
    })
})