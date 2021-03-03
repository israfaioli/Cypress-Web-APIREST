import locators from './locators'

Cypress.Commands.add('getToken', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'https://barrigarest.wcaquino.me/signin',
        body: {
            email: email,
            redirecionar: false,
            senha: senha
        }
    }).its('body.token').should('not.be.empty')
        .then(token => {
            return token
        })
})