// Basket (and followups) handlers

const {Suggestion} = require('dialogflow-fulfillment');
const Utility = require('./utility')

// HANDLER - Handle the basketAddIntent
function basketAddHandler() {
    
    console.log('basketAddHandler')

    // Text
    agent.add('Ottima scelta, ho aggiunto il prodotto al tuo carrello!')
    agent.add('Posso fare altro per te?')

    // Suggestions
    agent.add(new Suggestion('Vedi carrello'));
    agent.add(new Suggestion("Procedi all'acquisto"));
    agent.add(new Suggestion('Vorrei un consiglio'));
    agent.add(new Suggestion('Esplora le categorie'))

    // Contexts
    Utility.clearAllContexts();
}

module.exports = {
    basketAddHandler: basketAddHandler
};