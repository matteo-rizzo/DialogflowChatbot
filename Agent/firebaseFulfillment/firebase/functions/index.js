/**
 * Firebase fulfillment for the Dialogflow DianaAgent
 * 
 * This is the Firebase function entry point and only handles intent mapping via intents handlers.
 * An intent handler follows the succeeding pattern:
 * 
 * function exampleHandler(agent) {
 *  
 *   ...
 *   ... some logic here
 *   ...
 *  
 *   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
 *   agent.add(new Card({
 *       title: `Title: this is a card title`,
 *       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
 *       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
 *       buttonText: 'This is a button',
 *       buttonUrl: 'https://assistant.google.com/'
 *      })
 *   );
 *   agent.add(new Suggestion(`Quick Reply`));
 *   agent.add(new Suggestion(`Suggestion`));
 *   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
 * }
 * 
 * Notice: do not change the dialogflowFirebaseFulfillment funtion name
 * Function deployment: firebase deploy --only functions:dialogflowFirebaseFulfillment
 * 
 */

'use strict';
 
const functions = require('firebase-functions');
const Menu = require('./menu')
const Greetings = require('./greetings')
const ShoppingAdvisor = require('./shoppingadvisor')
const Basket = require('./basket')
const ProductSearch = require('./productsearch')
const ProductDetails = require('./productdetails')
const {WebhookClient} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // Enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    // Cache control
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    // Agent declaration
    // Notice that the agent is global so that it can be referenced within external files
    global.agent = new WebhookClient({ request, response });

    // Dialogflow request log
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    // Function handler intent mapping

    // When a specific intent is detected, the related mapped function is called    
    let intentMap = new Map();

    // Menu => ./menu.js
    intentMap.set('menu', Menu.menuHandler)

    // Greetings => ./greetings.js
    intentMap.set('greetings', Greetings.greetingsHandler);

    // Shopping advisor => ./shoppingadvisor.js
    intentMap.set('shoppingAdvisor', ShoppingAdvisor.shoppingAdvisorHandler);
    intentMap.set('shoppingAdvisorProposal', ShoppingAdvisor.shoppingAdvisorProposalHandler);
    intentMap.set('shoppingAdvisorProposal.yes', ShoppingAdvisor.shoppingAdvisorHandler);

    // Product search => ./productsearch.js
    intentMap.set('productSearch', ProductSearch.productSearchSFRouter);
    intentMap.set('productSearch.gender', ProductSearch.productSearchSFRouter);
    intentMap.set('productSearch.macrocategory', ProductSearch.productSearchSFRouter);
    intentMap.set('productSearch.sport', ProductSearch.productSearchSFRouter);
    intentMap.set('productSearch.shoes', ProductSearch.productSearchSFRouter);
    intentMap.set('productSearch.accessories', ProductSearch.productSearchSFRouter);
    intentMap.set('productSearch.clothing', ProductSearch.productSearchSFRouter);
    intentMap.set('productSearch.fallback', ProductSearch.productSearchFallbackHandler);
    intentMap.set('productSearch.yes', ShoppingAdvisor.shoppingAdvisorHandler);

    // Product details => ./productdetails.js
    intentMap.set('productDetails', ProductDetails.productDetailsHandler);
    intentMap.set('productDetails.previous', ProductSearch.productSearchFulfillment);
    intentMap.set('productDetails.fallback', ProductDetails.productDetailsFallbackHandler);
    intentMap.set('productDetails.color', ProductDetails.productDetailsColorHandler);
    intentMap.set('productDetails.color.previous', ProductDetails.productDetailsHandler);
    intentMap.set('productDetails.size', ProductDetails.productDetailsSizeHandler);
    intentMap.set('productDetails.size.previous', ProductDetails.productDetailsHandler);
    intentMap.set('productDetails.price', ProductDetails.productDetailsPriceHandler);
    intentMap.set('productDetails.price.previous', ProductDetails.productDetailsHandler);
    intentMap.set('productDetails.review', ProductDetails.productDetailsReviewHandler);
    intentMap.set('productDetails.review.previous', ProductDetails.productDetailsHandler);
    intentMap.set('productDetails.material', ProductDetails.productDetailsMaterialHandler);
    intentMap.set('productDetails.material.previous', ProductDetails.productDetailsHandler);

    // Basket
    intentMap.set('basketAdd', Basket.basketAddHandler);

    // Handle current intent
    agent.handleRequest(intentMap);
});