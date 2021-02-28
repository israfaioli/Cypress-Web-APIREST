const locators = {
    LOGIN: {
        EMAIL: '[data-test=email]',
        PASSWORD: '[data-test=passwd]',
        LOGIN_BUTTON: '.btn'
    },

    MESSAGE_CONTAINER: '.toast-message',
    CLOSE_CONTAINER_BUTTON: '.toast-info > .toast-close-button',

    MENU: {
        SETTINGS: '[data-test=menu-settings]',
        CONTAS: '[href="/contas"]',
        RESETAR: '[href="/reset"]',
        MOVIMENTACAO: '[data-test=menu-movimentacao]',
        HOME: '[data-test=menu-home] > .fas',
        EXTRATO: '[data-test=menu-extrato] > .fas'
    },

    CONTAS: {
        NAME: '[data-test=nome]',
        SAVE_BUTTON: '.btn',
        XP_MODIFY_BUTTON: contaNome => `//table//td[contains(.,'${contaNome}')]/..//i[@class='far fa-edit']`
    },

    MOVIMENTACAO: {
        DESCRIPTION: '[data-test=descricao]',
        VALUE: '[data-test=valor]',
        INTERESTED: '[data-test=envolvido]',
        CONTA: '[data-test=conta]',
        SAVE_BUTTON: '.btn-primary',
        STATUS: '[data-test=status]'
    },

    EXTRATO: {
        LINES: '.list-group > li',
        FN_XP_SEARCH_ELEMENT: (desc, value) => `//span[contains(., '${desc}')]/following-sibling::small[contains(., '${value}')]`,
        FN_XP_REMOVE_ELEMENT: conta => `//span[contains(., '${conta}')]/../../..//i[@class='far fa-trash-alt']`,
        FN_XP_UPDATE_ELEMENT: conta => `//span[contains(., '${conta}')]/../../..//i[@class='fas fa-edit']`,
        FN_XP_LINE: desc => `//span[contains(., '${desc}')]/../../../..`
    },

    SALDO: {
        FN_XP_SALDO_CONTA: nome => `//td[contains(., '${nome}')]/../td[2]`
    },
}

export default locators;