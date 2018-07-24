// Shopping advisor (and followups) handlers

const {Suggestion} = require('dialogflow-fulfillment');
const Utility = require('./utility');

// HANDLER - Product search entry point
function shoppingAdvisorHandler() {

    console.log('shoppingAdvisorHandler');

    // Text
    agent.add(`Molto bene! Solo qualche domanda per raffinare la ricerca. Innanzitutto, cerchi per uomo, donna o bambino?`);
    agent.add(new Suggestion(`Uomo`));
    agent.add(new Suggestion(`Donna`));
    agent.add(new Suggestion(`Bambino`));

    // Context
    console.log('Setting context productsearch...');
    agent.setContext({
        name: 'productsearch',
        lifespan: 20
    })
}

// HANDLER - Product search proposal
function shoppingAdvisorProposalHandler() {
    
    console.log('shoppingAdvisorProposalHandler');

    // Text
    agent.add('Mi spiace, posso consigliarti qualche altro prodotto in questo caso?')
    agent.add(new Suggestion(`Va bene`));
    agent.add(new Suggestion(`No, grazie`));

    // Contexts
    Utility.clearAllContexts();
}

module.exports = {
    shoppingAdvisorHandler: shoppingAdvisorHandler,
    shoppingAdvisorProposalHandler: shoppingAdvisorProposalHandler
};