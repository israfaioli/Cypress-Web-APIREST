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

    it('inserir uma nova conta', () => {
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

    it('alterar uma conta', () => {
        cy.getContaByName('Conta para alterar')
            .then(contaId => {
                cy.request({
                    url: `/contas/${contaId}`,
                    method: 'PUT',
                    headers: { Authorization: `JWT ${token}` },
                    body: {
                        nome: 'conta alterada via PUT'
                    }
                }).as('response')

            })

        cy.get('@response').its('status').should('be.equal', 200)
    })

    it('Criar conta com o mesmo nome', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    })

    it('criar uma nova transação', () => {
        cy.getContaByName('Conta para movimentacoes')
            .then(contaId => {
                cy.request({
                    method: 'POST',
                    url: '/transacoes',
                    headers: { Authorization: `JWT ${token}` },
                    body: {
                        conta_id: contaId,
                        data_pagamento: Cypress.moment().add({ days: 1 }).format('DD/MM/YYYY'),
                        data_transacao: Cypress.moment().format('DD/MM/YYYY'),
                        descricao: "desc",
                        envolvido: "inter",
                        status: true,
                        tipo: "REC",
                        valor: "123",
                    }
                }).as('response')
            })
        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    })

    it('Obter saldo', () => {
        cy.request({
            method: 'GET',
            url: '/saldo',
            headers: { Authorization: `JWT ${token}` }
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if (c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('534.00')
        })

        cy.request({
            method: 'GET',
            url: '/transacoes',
            headers: { Authorization: `JWT ${token}` },
            qs: { descricao: 'Movimentacao 1, calculo saldo' }
        }).then(res => {
            console.log(res.body[0])
            cy.request({
                url: `/transacoes/${res.body[0].id}`,
                method: 'PUT',
                headers: { Authorization: `JWT ${token}` },
                body: {
                    status: true,
                    data_transacao: Cypress.moment(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment(res.body[0].data_pagamento).format('DD/MM/YYYY'),
                    descricao: res.body[0].descricao,
                    envolvido: res.body[0].envolvido,
                    valor: res.body[0].valor,
                    conta_id: res.body[0].conta_id
                }
            }).its('status').should('be.equal', 200)
        })

        cy.request({
            url: '/saldo',
            method: 'GET',
            headers: { Authorization: `JWT ${token}` }
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if (c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('4034.00')
        })
    })


    it('deletar uma transação', () => {
        cy.request({
            method: 'GET',
            url: '/transacoes',
            headers: { Authorization: `JWT ${token}` },
            qs: { descricao: 'Movimentacao para exclusao' }
        }).then(res => {
            cy.request({
                url: `/transacoes/${res.body[0].id}`,
                method: 'DELETE',
                headers: { Authorization: `JWT ${token}` },
            }).its('status').should('be.equal', 204)
        })
    })
})