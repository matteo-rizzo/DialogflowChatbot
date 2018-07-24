// Greetings (and followups) handlers

const {Suggestion} = require('dialogflow-fulfillment');

// HANDLER - Triggers the greetings and the main functionalities selection
function greetingsHandler() {

    console.log('greetingsHandler');

    agent.add(`Ciao, sono Marcello, il tuo assistente personale Diadora`);
    agent.add(`Sono qui per aiutarti a trovare il prodotto più adatto a te`);
    agent.add(`Posso esserti utile in qualche modo?`);
    agent.add(new Suggestion(`Voglio esplorare le categorie`));
    agent.add(new Suggestion(`Ho in mente un prodotto specifico`));
    agent.add(new Suggestion(`Vorrei un consiglio`));
}

module.exports = {
    greetingsHandler: greetingsHandler
};