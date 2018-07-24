/**
 * Webhook slot filling handlers
 * 
 * See the following docs for reference:
 * https://dialogflow.com/docs/concepts/slot-filling
 * 
 * Notice that at the time being (7/18) slot filling via webhook is not properly documented in the official references 
*/

const APIcaller = require('./apicaller')
const {Suggestion} = require('dialogflow-fulfillment');

// SLOT FILLING - Return suggestions for all available MACROCATEGORIES for the given gender
function macrocategorySF(gender) {

    console.log('macrocategorySF');

    return APIcaller.callCategoriesApi(gender)
        .then((macrocategories) => {
            // Text
            let macrocategoriesPrompt = macrocategories.slice(0, macrocategories.length-1).join(", ");
            agent.add('Cerchi ' + macrocategoriesPrompt + " o " + macrocategories[macrocategories.length-1] + '?');

            // Suggestions
            for(let i in macrocategories)
            agent.add(new Suggestion(macrocategories[i]));
            
        })
        .catch((fault) => {
            console.error(fault);
        });
}

// SLOT FILLING - Return suggestions for all available CATEGORIES for the given macrocategory
function categorySF(gender, macrocategory) {

    console.log('categorySF');

    return APIcaller.callCategoriesApi(String(gender + '-' + macrocategory))
    .then((categories) => {
        // Suggestions
        for(let i in categories)
        agent.add(new Suggestion(categories[i]));
    })
    .catch((fault) => {
        console.error(fault);
    });
}

// SLOT FILLING - Return suggestions for all available GENDERS
function genderSF() {

    console.log('genderSF');

    agent.add(new Suggestion(`Uomo`));
    agent.add(new Suggestion(`Donna`));
    agent.add(new Suggestion(`Bambino`));
}

module.exports = {
    macrocategorySF: macrocategorySF,
    categorySF: categorySF,
    genderSF: genderSF
};