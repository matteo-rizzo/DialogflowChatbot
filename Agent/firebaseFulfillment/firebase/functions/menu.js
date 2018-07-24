// Menu handler

const {Suggestion} = require('dialogflow-fulfillment');

// Triggers the bot menu
function menuHandler() {
    console.log('menuHandler');

    agent.add('Questi sono alcuni dei modi in cui posso aiutarti nella tua visita allo store online Diadora')
    agent.add(new Suggestion(`Esplorazione delle categorie`));
    agent.add(new Suggestion(`Ricerca prodotto specifico`));
    agent.add(new Suggestion(`Suggerimento prodotto`));
}

module.exports = {
    menuHandler: menuHandler
};