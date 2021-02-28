import locators from './locators'

Cypress.Commands.add('accessAccountMenu', () => {
    cy.get(locators.MENU.SETTINGS).click()
    cy.get(locators.MENU.CONTAS).click()
})

Cypress.Commands.add('createNewAccount', (account) => {
    cy.get(locators.CONTAS.NAME).type(account)
    cy.get(locators.CONTAS.SAVE_BUTTON).click()
})