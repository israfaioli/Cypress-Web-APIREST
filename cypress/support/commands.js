// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import locators from './locators'

Cypress.Commands.add('visitUrl',(URL) => {
    cy.visit(URL)
})

Cypress.Commands.add('clickAlert', (locator, message) => {
    cy.get(locator).click()
    cy.on('window:alert', msg => {
        console.log(msg)
        expect(msg).to.be.equal(message)
    })
})

Cypress.Commands.add('resetApplication', () => {
    cy.get(locators.MENU.SETTINGS).click()
    cy.get(locators.MENU.RESETAR).click()
})

Cypress.Commands.add('loginApplication', function() {
    cy.fixture('login').as('loginJson').then(() => {
        cy.visitUrl('http://barrigareact.wcaquino.me')
        cy.get(locators.LOGIN.EMAIL).type(this.loginJson.email)
        cy.get(locators.LOGIN.PASSWORD).type(this.loginJson.senha)
        cy.get(locators.LOGIN.LOGIN_BUTTON).click()
        cy.get(locators.MESSAGE_CONTAINER).should('have.text', 'Bem vindo, Israel Faioli!')
    })
})

Cypress.Commands.add('assertMessageContainer', (message) => {
    cy.get(locators.MESSAGE_CONTAINER).should('contain', message)
})