// Product details (and followups) handlers

const APIcaller = require('./apicaller')
const {Card, Suggestion} = require('dialogflow-fulfillment');

// UTILITIES

// Utility function for productDetailsHandler => print the suggestions to get detailed info about a product
function printProductDetailsSuggestions(product, exclusion = '') {

    console.log('printProductDetailsSuggestions');

    // Variation attributes
    for(let i in product.variation_attributes) {
        if(product.variation_attributes[i].name != exclusion)
        agent.add(new Suggestion(product.variation_attributes[i].name));
    }

    // Material
    if(exclusion !== 'Materiale' && product.hasOwnProperty('c_materiali'))
    agent.add(new Suggestion('Materiale'));

    // Rating
    if(exclusion !== 'Rating' && product.hasOwnProperty('c_feedatyAverageRatings'))
    agent.add(new Suggestion('Rating'));

    // Price
    if(exclusion !== 'Prezzo')
    agent.add(new Suggestion('Prezzo'));
    
    // Related
    agent.add(new Suggestion('Vedi prodotti simili'));

    //Add to cart
    agent.add(new Suggestion('Aggiungi al carrello'));
    
    // Previous
    if(!exclusion)
    agent.add(new Suggestion('Torna ai prodotti suggeriti'));
    else
    agent.add(new Suggestion('Torna al prodotto'));
}

// Utility function for productDetailsHandler => return the product ID of a product that has been selected within a carousel
function getSelectedProductID() {

    console.log('getSelectedProductID');

    // Get selection
    const selectedProduct = parseInt(String(agent.getContext('productdetails').parameters.selection)) || parseInt(String(agent.getContext('productdetails').parameters.defaultSelection));
    // Get id list
    const IDs = String(agent.getContext('productdetails').parameters.ids).split(',');

    if(selectedProduct < 4 && selectedProduct > 0) {
        // If the selection is in the correct range
        const id = IDs[selectedProduct-1];
        console.log(`Selected product is number ${selectedProduct}, which ID is ${id}`);
        return id;
    }
}

// Utility function for productDetailsSizeHandler => print the size chart
function getSizeChart() {

    console.log('getSizeChart');

    let gender = agent.getContext('productsearch').parameters.gender;
    console.log('Current gender: ' + gender);
    
    // Size chart
    agent.add('Se ti può essere utile, al link seguente trovi una guida alle taglie per ' + gender);
    agent.add(new Card({
        title: 'Guida taglie ' + gender,
        buttonText: 'Vai alla guida',
        buttonUrl: 'https://www.diadora.com/it/it/size-chart-page.html?category=' + gender 
    }));
}

// Utility function for productDetailsSizeHandler => print all available sizes and the size chart
function printSizeList(sizes) {
    
    console.log('printSizeList');

    // List all avaible sizes
    if(sizes.length > 1) {

        agent.add('Il prodotto è disponibile in ' + sizes.length + ' taglie, te le elenco qui sotto')

        for(let i in sizes)
        agent.add(sizes[i].name);
    }
    else
    agent.add("Il prodotto è disponibile in un'unica taglia, " + sizes[0].name)

    getSizeChart();
}

// HANDLERS

// Product details entry point
function productDetailsHandler() {

    console.log('productDetailsHandler');

    let id = getSelectedProductID();

    if(id) {
        // If the selection is well formed => it's possible to get the ID
        return APIcaller.callProductsApi(id)
        .then((product) => {
    
            // Text
            agent.add('Ecco ' + product.name + ', ' + product.short_description.split(' - ').join(" ").toLocaleLowerCase());
            agent.add(product.long_description);
            agent.add('Il suo prezzo è di ' + product.price + '€');

            // Cards
            for (let i in product.image_groups[1].images) {
                agent.add(new Card({ 
                    title: product.image_groups[1].images[i].alt,
                    imageUrl: product.image_groups[1].images[i].link 
                }));
            }
    
            agent.add('Desideri ulteriori informazioni a riguardo?')
    
            // Suggestions
            printProductDetailsSuggestions(product);
        })
        .catch((fault) => {
            console.error(fault);
        });
    }
    else {
        // Text
        agent.add('Mi spiace, credo di non aver capito, quale prodotto desideri vedere?')

        // Suggestions
        for(let i = 1; i < 4; i++)
        agent.add(new Suggestion(`Prodotto ${parseInt(i)}`))
    }
}

// Product color detail
function productDetailsColorHandler() {

    console.log('productDetailsColorHandler');

    return APIcaller.callProductsApi(getSelectedProductID(), true)
    .then((product) => {

        let colors = product.variation_attributes[0].values;
            
        console.log('Avaible colors: ' + JSON.stringify(colors, null, 2));
        
        // Text
        if(colors.length > 1)
        agent.add(product.name + ' è disponibile in ' + colors.length + ' colorazioni. La mia preferita è ' + colors[0].name + ', te la consiglio.')
        else
        agent.add(product.name + " è disponibile in un'unica colorazione, " + colors[0].name)
        
        // Cards
        for(let i in colors) {
            for(let j = 1; j < product.image_groups.length; j++) {
                if(product.image_groups[j].variation_attributes[0].values[0].value === colors[i].value) {
                    agent.add(new Card({
                        title: colors[i].name,
                        imageUrl: product.image_groups[j].images[0].link
                    }));
                    break
                }
            }
        }
    
        agent.add('Desideri aggiungere il prodotto al carrello? Altrimenti posso fornirti ulteriori dettagli');

        // Suggestions
        printProductDetailsSuggestions(product, 'colore');
    })
    .catch((fault) => {
        console.error(fault);
    });
}

// Product size detail
function productDetailsSizeHandler() {

    console.log('productDetailsSizeHandler');

    return APIcaller.callProductsApi(getSelectedProductID())
    .then((product) => {

        let sizes = product.variation_attributes[1].values;
        console.log('Avaible sizes: ' + JSON.stringify(sizes, null, 2));
        
        let selectedSize = agent.getContext('productsearch').parameters.size || agent.getContext('productdetails-followup').parameters.number;
        console.log('Selected size: ' + selectedSize);

        // Text
        if(selectedSize) {

            // If the user specified a size
            let avaible = false;

            // Check if the selected size is actually avaible
            for(let i = 0; i < sizes.length && !avaible; i++) {
                if(sizes[i].name == selectedSize) {
                    // If the size is avaible => answer yes
                    agent.add('Sì, ' + product.name + ' è disponibile in taglia ' + selectedSize);
                    getSizeChart();
                    agent.add('Desideri aggiungere il prodotto al carrello? Altrimenti posso fornirti ulteriori dettagli o mostrarti qualche prodotto simile')
                    avaible = true;
                }
            }
            
            if(!avaible) {

                // If the size is not avaible => answer no
                agent.add('Mi spiace, ' + product.name + ' non è disponibile in taglia ' + selectedSize);
                printSizeList(sizes);
                agent.add('Gradisci vedere qualche prodotto simile? Altrimenti posso fornirti ulteriori dettagli')
            }
        }
        else {
            // If the user did not specified a size => list avaible sizes
            printSizeList(sizes);
            agent.add('Personalmente mi piace molto, ma gradisci vedere qualche prodotto simile? Altrimenti posso fornirti ulteriori dettagli')
        }

        // Suggestions
        printProductDetailsSuggestions(product, 'Size');
    })
    .catch((fault) => {
        console.error(fault);
    });
}

// Product price detail
function productDetailsPriceHandler() {

    console.log('productDetailsPriceHandler');

    return APIcaller.callProductsApi(getSelectedProductID())
    .then((product) => {

        // Text
        agent.add(product.name + ' costa ' + product.price + '€, la spedizione è gratuita per ordini superiori a 49€');
        agent.add('Gradisci aggiungere il prodotto al carrello? Altrimenti, se desideri, posso mostrarti qualche prodotto simile o fornirti ulteriori dettagli')

        // Suggestions
        printProductDetailsSuggestions(product, 'Prezzo');
    })
    .catch((fault) => {
        console.error(fault);
    });
}

// Product review detail
function productDetailsReviewHandler() {

    console.log('productDetailsReviewHandler');

    return APIcaller.callProductsApi(getSelectedProductID())
    .then((product) => {

        if(product.hasOwnProperty('c_feedatyAverageRatings')) {
            let ratings = JSON.parse(product.c_feedatyAverageRatings);
            console.log(`Ratings: \n ${JSON.stringify(ratings, null, 2)}`);

            // Text
            // Best rating and quality
            let bestRating = ratings.CategoryQuestionsAnswers[0].Rating;
            let bestQuality = ratings.CategoryQuestionsAnswers[0].Question;
    
            for(let i in ratings.CategoryQuestionsAnswers) {
                if(ratings.CategoryQuestionsAnswers[i].Rating > bestRating) {
                    bestRating = ratings.CategoryQuestionsAnswers[i].Rating;
                    bestQuality = ratings.CategoryQuestionsAnswers[i].Question.toLocaleLowerCase();
                }
            }

            // Review
            if(ratings.RatingsCount > 1) {
                agent.add(product.name + ' è stato recensito da ' + ratings.RatingsCount + ' acquirenti verificati, e ha totalizzato un punteggio medio di ' + ratings.AverageValue + ' stelle su 5. Il prodotto spicca per ' + bestQuality + ', dove ha ricevuto una valutazione di ' + bestRating + '/5.');
                agent.add('Il ' + parseInt(ratings.CategoryQuestionsAnswers[3].Rating * 100) + '% dei nostri clienti è felice di consigliarlo.')
            }
            else
            agent.add('Finora, ' + product.name + ' è stato recensito da un solo acquirente verificato, che gli ha assegnato un punteggio di ' + ratings.AverageValue + ' stelle su 5. Alla domanda "Cosa hai apprezzato di più del prodotto?" ha risposto con una sola parola: "' + bestQuality + '"');
            
        }
        else 
        agent.add('Questo prodotto non è ancora stato recensito, se lo acquisti potresti essere il primo utente a darci la sua opinione!');
        
        agent.add('Desideri aggiungere il prodotto al carrello? Altrimenti posso mostrarti qualche prodotto simile o fornirti ulteriori dettagli')

        // Suggestions
        printProductDetailsSuggestions(product, 'Rating');
    })
    .catch((fault) => {
        console.error(fault);
    });
}

// Product material detail
function productDetailsMaterialHandler() {

    console.log('productDetailsMaterialHandler');

    return APIcaller.callProductsApi(getSelectedProductID())
    .then((product) => {

        if(product.hasOwnProperty('c_materiali')) {
            let material = product.c_materiali.toLocaleLowerCase();
            console.log(`Materials: \n ${material}`);

            // Text
            agent.add(product.name + ' è realizzato completamente in ' + material);
            agent.add('Desideri aggiungere il prodotto al carrello? Altrimenti posso mostrarti qualche prodotto simile o fornirti ulteriori dettagli')
        }
        else
        agent.add('Mi spiace, non trovo informazioni sui materiali con cui è stato realizzato questo prodotto! Posso fornirti ulteriori informazioni?');

        // Suggestions
        printProductDetailsSuggestions(product, 'Materiale');
    })
    .catch((fault) => {
        console.error(fault);
    });
}

// Product details fallback handler
function productDetailsFallbackHandler() {
    
    console.log('productDetailsFallbackHandler');

    const id = getSelectedProductID();

    if(id) {
        // If the selection is well formed => it's possible to get the ID
        return APIcaller.callProductsApi(id)
        .then((product) => {

            // Text
            agent.add('Scusami, probabilmente non ti seguo, stavamo parlando di ' + product.name + ' se non sbaglio.');
            agent.add('A cosa sei interessato?')

            // Suggestions
            printProductDetailsSuggestions(product);
        })
        .catch((fault) => {
            console.error(fault);
        });
    };
}

module.exports = {
    productDetailsHandler: productDetailsHandler,
    productDetailsColorHandler: productDetailsColorHandler,
    productDetailsSizeHandler: productDetailsSizeHandler,
    productDetailsPriceHandler: productDetailsPriceHandler,
    productDetailsReviewHandler: productDetailsReviewHandler,
    productDetailsMaterialHandler: productDetailsMaterialHandler,
    productDetailsFallbackHandler: productDetailsFallbackHandler
};