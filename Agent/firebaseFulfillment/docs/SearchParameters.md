<a name="SearchParameters"></a>

## SearchParameters ⇐ searchparameters.js

Utility class that handles parameters extraction from context. The parameters are defined as follow:

* GENDER
    * ex: uomo, donna, bambino...
* MACROCATEGORY
    * ex: scarpe, abbigliamento...
* CATEGORY
    * belongs to one of the following typologies:
        - shoes ⇐ ex: heritage, sportswear...
        - clothing ⇐ ex: t-shirt, pantaloni...
        - accessories ⇐ ex: ginocchiere, guanti da calcio...
        - sport ⇐ ex: tennis, calcio... 

Note that macrocategories and categories are double mapped for entity recognition purposes:

| Macrocategory |  category    |
| --- | --- |
| scarpe        | shoes       |
| abbigliamento | clothing    |
| accessori     | accessories |
| sport         | sport       |


* Methods
    * Constructor
        * [constructor](#constructor)
    * Utilities
        * [getMacrocategoryByCategory](#getMacrocategoryByCategory)
        * [getCategoryMap](#getCategoryMap)
        * [getCategoryNamesMap](#getCategoryNamesMap)
    * Public methods
        * [getQuery](#getQuery)

<a name="constructor"></a>

## Constructor

### constructor
Construct the SearchParameters object retrieving the data by parsing the JSON request. The constructor handles particular cases and makes sure that the search parameters are properly mapped. 

**Kind**: constructor 

**Example**  
```js
let searchParameters = new SearchParameters(); 
```

## Utilities

<a name="getMacrocategoryByCategory"></a>

### getMacrocategoryByCategory
Return proper `macrocategory` for the first category that has been defined.

**Kind**: utility 

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>parameters</code> | the JSON parsed parameters used to retrieve macrocategory value |

**Example**  
```js
this.macrocategory = this.getMacrocategoryByCategory(parameters)
```

<a name="getCategoryMap"></a>

### getCategoryMap
Define the category parameters and return a `macrocategory`-`category` key-value map.

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>parameters</code> | the JSON parsed parameters used to retrieve category values |

**Kind**: utility

**Example**  
```js
let parameters = agent.getContext('productsearch').parameters;
const categoryMap = this.getCategoryMap(parameters)
```
<a name="getCategoryNamesMap"></a>

### getCategoryNamesMap
Define and return a `macrocategory`-`categoryname` key-value map.

**Kind**: utility 

**Example**  
```js
const categoryNamesMap = this.getCategoryNamesMap()
```

## Public methods

<a name="getQuery"></a>

### getQuery
Get the relevant search parameters as a strings array in order to make the API call.

**Kind**: public method

**Example**  
```js
const searchparameters = new SearchParameters();
const cgid = searchParameters.getQuery().join("-");
```