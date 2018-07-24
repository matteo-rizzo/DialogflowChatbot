<a name="ProductSearch"></a>

## ProductSearch ⇐ productsearch.js

Webhook slot filling handlers, see the following docs for reference: https://dialogflow.com/docs/concepts/slot-filling
```
Notice that at the time being (7/2018) slot filling via webhook is not properly documented in the official references, which means the following is a personal interpretation of how to handle webhook slot filling. 
```
* Functions
    * [genderSF](#genderSF)
    * [macrocategorySF](#macrocategorySF)
    * [categorySF](#categorySF)

<a name="genderSF"></a>

### genderSF
Return suggestions for all available `gender`'s. Notice that `gender`'s are statically generated.

**Kind**: exported 

**Example**  
```js
return genderSF() 
```

<a name="macrocategorySF"></a>

### macrocategorySF
Return suggestions for all available `macrocategory`'s for the given gender. `macrocategory`'s are dynamically generated via API call.

**Kind**: exported 

| Param | Type | Description |
| --- | --- | --- |
| gender | <code>string</code> | the gender parameter for the product research |

**Example**  
```js
let searchParameters = new SearchParameters(); 
let gender = searchParameters.gender;
return macrocategorySF(gender) 
```
<a name="categorySF"></a>

### categorySF
Return suggestions for all available `category`'s for the given gender and macrocategory. `category`'s are dynamically generated via API call.

**Kind**: exported 

| Param | Type | Description |
| --- | --- | --- |
| gender | <code>string</code> | the gender parameter for the product research |
| macrocategory | <code>string</code> | the macrocategory parameter for the product research |

**Example**  
```js
let searchParameters = new SearchParameters(); 
let gender = searchParameters.gender;
let macrocategory = searchParameters.macrocategory;
return categorySF(gender, macrocategory) 
```