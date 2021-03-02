/// <reference types = "cypress" />

describe('testes automatizados de apirest para portfólio', () => {
    before(() => {

    })

    beforeEach(() => {

    })

    it('login', () => {
        cy.request({
            method: 'POST',
            url: 'https://barrigarest.wcaquino.me/signin',
            body: {
                email: "israfaioli@gmail.com",
                redirecionar: false,
                senha: "123456"
            }
        }).its('body.token').should('not.be.empty')
    })

    it.only('inserir uma nova conta', () => {
        cy.request({
            method: 'POST',
            url: 'https://barrigarest.wcaquino.me/signin',
            body: {
                email: "israfaioli@gmail.com",
                redirecionar: false,
                senha: "123456"
            }
        }).its('body.token').should('not.be.empty')
          .then(token => {
            cy.request({
                method: 'POST',
                url: 'https://barrigarest.wcaquino.me/contas',
                headers: {Authorization: `JWT ${token}`},
                body: {
                    nome: "conta via apirest"
                }
            }).as('response')
        })

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).has.property('nome', 'conta via apirest')
            expect(res.body).has.property('id').is.not.null
        })
    })
})