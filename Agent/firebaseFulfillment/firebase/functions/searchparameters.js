/**
 *  @SearchParameters
 * 
 *  Utility class that handles parameters extraction from context
 * 
 *  Aggregates the search parameters for a product search. The parameters are defined as follow:
 *  - GENDER         -> ex: uomo, donna, bambino...
 *  - MACROCATEGORY  -> ex: scarpe, abbigliamento...
 *  + CATEGORY       -> belongs to one of the following typologies:
 *      - shoes | ex: heritage, sportswear...
 *      - clothing | ex: t-shirt, pantaloni...
 *      - accessories | ex: ginocchiere, guanti da calcio...
 *      - sport | ex: tennis, calcio... 
 * 
 *  Note that macrocategories and categories are double mapped for entity recognition purposes:
 *  ---------------------------------
 *  | Macrocategory |   category    |
 *  ---------------------------------
 *  | scarpe        |   shoes       |
 *  | abbigliamento |   clothing    |
 *  | accessori     |   accessories |
 *  | sport         |   sport       |
 *  ---------------------------------
 * 
 */

class SearchParameters {

    // Constructor
    constructor() {

        console.log('Constructing search parameters...');

        // Get search parameters from JSON response
        let parameters = agent.getContext('productsearch-followup').parameters || agent.getContext('productsearch').parameters;
        console.log(`Parameters in the request: \n ${JSON.stringify(parameters, null, 2)}`)

        if(parameters) {
            // Get @color - the color name must start with a capital letter
            this.color = String(parameters.color);
            if(this.color)
            console.log("* Colors: " + this.color);
    
            // Get @gender
            this.gender = String(parameters.gender).toLocaleLowerCase();
            if(this.gender)
            console.log("* Gender: " + this.gender);
    
            // Get @macrocategory
            this.macrocategory = String(parameters.macrocategory).toLocaleLowerCase();
            // this.macrocategory = String(parameters.macrocategory).toLocaleLowerCase() || this.getMacrocategoryByCategory(parameters);
    
            // Try to get @macrocategory by @category for queries of the type '@category @gender' (i.e. @category implies mapped @macrocategory)
            // Ex: query = 'Felpe donna' => since (@category) 'felpe' belongs to (@macrocategory) 'abbigliamento' then @macrocategory === 'abbigliamento'
            if(!this.macrocategory || this.macrocategory === 'undefined')
            this.macrocategory = this.getMacrocategoryByCategory(parameters);
            
            console.log("* Macrocategory: " + this.macrocategory);

            // Get @category
            
            // Category mapping
            const categoryNamesMap = this.getCategoryNamesMap();
            const categoryMap = this.getCategoryMap(parameters);
    
            // Handling ambiguity between 'shoes' categories and @sport
            if(this.macrocategory === 'scarpe' && ( (categoryMap.get('sport') && categoryMap.get('sport') !== 'undefined') || (!categoryMap.get('scarpe') || categoryMap.get('scarpe') === 'undefined') )) {
                // If the current @macrocategory is 'scarpe' but a @sport has been defined (or no actual 'shoes' category has been defined)
                this.category = categoryMap.get('sport');
                this.categoryName = 'sport';
            }
            else {
                // Default case => if a @macrocategory has been defined, a specific @category type is expected
                // Ex: (@macrocategory) 'scarpe' => (@category) 'shoes' (i.e. Heritage, Sportswear...)
                this.category = categoryMap.get(this.macrocategory);
                this.categoryName = categoryNamesMap.get(this.macrocategory);
            }
    
            // Normalize category names with spaces and commas
            // Ex: guanti, sciarpe e polsini  => guanti_sciarpe_e_polsini
            if(this.category && this.category != "undefined")
            this.category = (this.category).split(" ").join("_").split(",_").join("_");

            console.log("* Category: " + this.category);
        }
        else
        console.log('No parameters detected, cannot construct search parameters')

        console.log(`Constructed parameter: \n ${JSON.stringify(this, null, 2)}`)
    }

    // Return proper macrocategory for the first category that has been defined
    getMacrocategoryByCategory(parameters) {
        
        console.log('getMacrocategoryByCategory');

        const categoryMap = this.getCategoryMap(parameters);
        let iterator = categoryMap.keys();
        let category;

        for (let macrocategory of iterator) { 
            category = categoryMap.get(macrocategory);
            if(category && category !== 'undefined')
            return macrocategory
        }
    }

    // Define the category parameters and return a macrocategory-category key-value map
    getCategoryMap(parameters) {

        console.log('getCategoryMap');

        const shoes = String(parameters.shoes).toLocaleLowerCase();
        const clothing = String(parameters.clothing).toLocaleLowerCase();
        const accessories = String(parameters.accessories).toLocaleLowerCase();
        const sport = String(parameters.sport).toLocaleLowerCase();

        // Debug log
        if(shoes && shoes !== 'undefined') 
        console.log("* Shoes: " + shoes);
        if(clothing && clothing !== 'undefined')
        console.log("* Clothing: " + clothing);
        if(accessories && accessories !== 'undefined')
        console.log("* Accessories: " + accessories);
        if(sport && sport !== 'undefined')
        console.log("* Sport: " + sport);

        return new Map([
            ["scarpe", shoes],
            ["abbigliamento", clothing],
            ["accessori", accessories],
            ["sport", sport]
        ]);
    }

    // Return a macrocategory-categoryname key-value map
    getCategoryNamesMap() {

        console.log('getCategoryNamesMap');

        return new Map([
            ["scarpe", "shoes"],
            ["abbigliamento", "clothing"],
            ["accessori", "accessories"],
            ["sport", "sport"]
        ]);
    }

    // Get the relevant search parameters as a strings array 
    getQuery() {
        
        console.log('getQuery');

        return [
            this.gender,
            this.macrocategory,
            this.category 
        ];
    }
}

module.exports = SearchParameters;