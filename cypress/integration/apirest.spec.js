/// <reference types = "cypress" />

import '../support/commandsApiRest'

let token

describe('testes automatizados de apirest para portfólio', () => {
    before(() => {
        cy.getToken('israfaioli@gmail.com', '123456').then(tkn => {
            token = tkn
        })
    })

    beforeEach(() => {
        cy.request({
            method: 'GET',
            url: '/reset',
            headers: {
                Authorization: `JWT ${token}`
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(200)
        })

    })

    it.only('inserir uma nova conta', () => {
        cy.request({
            method: 'POST',
            url: '/contas',
            headers: {
                Authorization: `JWT ${token}`
            },
            body: {
                nome: "conta via apirest"
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).has.property('nome', 'conta via apirest')
            expect(res.body).has.property('id').is.not.null
        })
    })
})