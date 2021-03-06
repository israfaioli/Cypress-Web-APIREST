import locators from './locators'

Cypress.Commands.add('getToken', (email, senha) => {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: email,
            redirecionar: false,
            senha: senha
        }
    }).its('body.token').should('not.be.empty')
        .then(token => {
            Cypress.env('token', token)
            return token
        })
})

Cypress.Commands.add('getContaByName', name => {
    cy.getToken('israfaioli@gmail.com', '123456').then(token => {
        cy.request({
            method: 'GET',
            url: '/contas',
            headers: { Authorization: `JWT ${token}` },
            qs: {
                nome: name
            }
        }).then(res => {
            return res.body[0].id
        })
    })
})