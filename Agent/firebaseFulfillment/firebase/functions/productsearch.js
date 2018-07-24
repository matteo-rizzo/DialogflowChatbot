// Product search intent (and followups) handlers

const APIcaller = require('./apicaller')
const SlotFiller = require('./slotfiller')
const SearchParameters = require('./searchparameters')
const {Card, Suggestion} = require('dialogflow-fulfillment');
const Utility = require('./utility')

// FULFILLMENT - Handle the fulfillment of product research giving the actual result
function productSearchFulfillment(searchParameters) {

    console.log('productSearchFulfillment');

    searchParameters = new SearchParameters();
    
    return APIcaller.callProductSearchApi(searchParameters).then((products) => {

        // If the API call retrieved 0 results => prompt the user for another try in the catch block
        if(typeof products === "undefined" || products.length === 0)
        throw new Error('0 results!')

        // Remove duplicates in order to propose distinct products only and get all the product IDs
        const IDs = [];
        const flags = new Set();
        const uniqueProducts = products.filter(product => {
            if(flags.has(product.name))
            return false;
            flags.add(product.name);
            IDs.push(product.id);
            return true;
        });
        console.log(`Number of unique products: ${uniqueProducts.length}`);
        console.log(`Unique products: \n ${JSON.stringify(uniqueProducts, null, 2)}`);

        // Text
        if(uniqueProducts.length === 1)
        agent.add('Ho trovato un solo prodotto che rispondesse alle tue esigenze, spero ti piaccia!');
        else {
            // Handle specific answers
            if(searchParameters.macrocategory === "sport") {
                if(searchParameters.category === "calcio")
                    // If the user selected 'calcio' => give bot background answer
                    agent.add("Adoro giocare a calcio, un tempo ero un attaccante! Questi sono " + uniqueProducts.length +  " dei miei prodotti preferiti per giocare, tratti dalla collezione " + searchParameters.gender + '.');
                else {
                    // If the user indicated a sport => give personalized answer
                    agent.add("Questi sono alcuni dei miei prodotti preferiti per praticare il " + (searchParameters.category).split('_').join(' ') + ", tratti dalla categoria " + searchParameters.macrocategory + ' ' + searchParameters.gender + '.');
                }
            }
            else {
                // Else give default answer
                agent.add("Questi sono alcuni dei miei prodotti preferiti dalla collezione " + (searchParameters.category).split('_').join(' ') + " per la categoria " + searchParameters.macrocategory + ' ' + searchParameters.gender + '.');
            }
    
            if(searchParameters.color)
            agent.add('Ho selezionato solo prodotti di colore ' + searchParameters.color.split(",").join(' o ').toLocaleLowerCase());
        }

        // Products cards
        for(let i = 0; i < 3 && i < uniqueProducts.length; i++) {
            agent.add(new Card({
                    title: uniqueProducts[i].name,
                    imageUrl: uniqueProducts[i].image_groups[1].images[0].link,
                    text: uniqueProducts[i].long_description,
                    buttonText: `Vai a prodotto ${parseInt(i+1)}`,
                    buttonUrl:  'https://dev01-diana01-dianacorp.demandware.net/s/Diadora/it/it/' + uniqueProducts[i].id + '.html'
                })
            );
        }
        
        // Suggestions
        let selection;
        if(uniqueProducts.length > 1) {
            agent.add("Vedi qualcosa che ti piace? Sarò felice di mostrartela in dettaglio");
    
            for(let i = 0; i < 3 && i < uniqueProducts.length; i++)
            agent.add(new Suggestion(`Prodotto ${parseInt(i+1)}`));

            agent.add(new Suggestion(`Questi prodotti non mi interessano`));
        }
        else {
            selection = 1;
            agent.add(new Suggestion('Vedi prodotto nel dettaglio'));
            agent.add(new Suggestion(`Questo prodotto non mi interessa`));
        }       

        // Contexts
        // After fulfillment, remember the proposed products IDs in order to reference them in the productdetails intent.
        // Notice that due to a potential Dialogflow bug, you cannot send the IDs as an object but you need to use a string instead,
        // defaultSelection is used in order to handle the one product result case
        console.log('Setting context productdetails and shoppingadvisorproposal...');
        agent.setContext({name: 'productdetails', lifespan: 5, parameters: { ids: IDs.toString(), defaultSelection: selection }});
        agent.setContext('shoppingadvisorproposal');

    }).catch((err) => {

        // Log the error
        console.log(`Something went wrong with the API call: ` + err);

        // If an error with the API call occurred => prompt the user for another try
        agent.add('Mi spiace, temo di non avere prodotti che soddisfino le tue esigenze!');
        agent.add('Possiamo fare un altro tentativo?');
        agent.add(new Suggestion(`Va bene`));
        agent.add(new Suggestion('No, grazie'));

        // Contexts
        Utility.clearAllContexts();
    });
}

// HANDLER - Product search fallback
function productSearchFallbackHandler() {
    console.log('productSearchFallbackHandler');

    agent.add('Scusa, forse non ho capito bene');

    // Extract search parameters from context
    let searchParameters = new SearchParameters();

    // Prompt gender
    if(!searchParameters.gender) {
        if(searchParameters.macrocategory) {
            if(searchParameters.category)
            agent.add('Se non sbaglio, eri interessato alla categoria ' + searchParameters.category + '. Cerchi per uomo, donna o bambino?')
            else
            agent.add('Se non sbaglio, eri interessato alla categoria ' + searchParameters.macrocategory + '. Cerchi per uomo, donna o bambino?')
        }
        else
        agent.add("Cerchi per uomo, donna o bambino?");
        return SlotFiller.genderSF();
    }
    
    // Prompt macrocategory
    if(!searchParameters.macrocategory || searchParameters.macrocategory === "undefined") {
        agent.add('Se non sbaglio, cercavi prodotti da ' + searchParameters.gender + '. Qui sotto puoi vedere le relative categorie disponibili.')
        return SlotFiller.macrocategorySF(searchParameters.gender);
    }
    
    // Prompt category
    if(!searchParameters.category || searchParameters.category === "undefined") {

        if(searchParameters.macrocategory === 'sport')
        agent.add('Temo di non avere nulla per praticare lo sport che desideri, ma ho prodotti per tutti gli sport qui di seguito');
        else
        agent.add('Se non sbaglio, cercavi ' + searchParameters.macrocategory + ' da ' + searchParameters.gender + '. Qui sotto puoi vedere le relative categorie disponibili.')

        return SlotFiller.categorySF(searchParameters.gender, searchParameters.macrocategory);
    }

    agent.add('Scusa, possiamo fare un altro tentativo?');
}

// ROUTER - Product search slot filling router
function productSearchSFRouter() {
    
    console.log('productSearchSFRouter');

    // Extract search parameters from context
    let searchParameters = new SearchParameters();

    // Prompt gender
    if(!searchParameters.gender) {
        agent.add("Certo. Cerchi per uomo, donna o bambino?");
        return SlotFiller.genderSF();
    }
    
    // Prompt macrocategory
    if(!searchParameters.macrocategory || searchParameters.macrocategory === "undefined")
    return SlotFiller.macrocategorySF(searchParameters.gender);
    
    // Prompt category
    if(!searchParameters.category || searchParameters.category === "undefined") {
        if(searchParameters.macrocategory === 'sport')
        agent.add("Grande! E quale di questi sport pratichi?");
        else
        agent.add("Ottimo! E a quale di queste categorie sei interessato?");

        return SlotFiller.categorySF(searchParameters.gender, searchParameters.macrocategory);
    }

    // Give fulfillment answer to the user query
    return productSearchFulfillment(searchParameters);
}

module.exports = {
    productSearchFulfillment: productSearchFulfillment,
    productSearchFallbackHandler: productSearchFallbackHandler,
    productSearchSFRouter: productSearchSFRouter
};