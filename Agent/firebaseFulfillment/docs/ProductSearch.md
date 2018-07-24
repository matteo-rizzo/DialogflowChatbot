<a name="ProductSearch"></a>

## ProductSearch ⇐ productsearch.js

Product search intent (and followups) handlers

* Functions
    * Fulfillment
        * [productSearchFulfillment](#productSearchFulfillment)
    * Handlers
        * [productSearchFallbackHandler](#productSearchFallbackHandler)
    * Router
        * [productSearchSFRouter](#productSearchSFRouter)

## Fulfillment

<a name="productSearchFulfillment"></a>

### productSearchFulfillment
Handle the fulfillment of product research giving the actual result. The function is exported in order to properly handle the return to the previous page in some `.previous` intents mapping.

**Kind**: exported 

| Param | Type | Description |
| --- | --- | --- |
| searchParameters | <code>SearchParameters</code> | the parameters for the product research |

**Example**  
```js
let searchParameters = new SearchParameters(); 

return productSearchFulfillment(searchParameters) 
```

## Handlers

<a name="productSearchFallbackHandler"></a>

### productSearchFallbackHandler
Properly handle the fallback for the productSearchIntent.

**Kind**: exported 

## Router

<a name="productSearchSFRouter"></a>

### productSearchSFRouter
Route the current parameter towards the proper slot-filler function. Example: if the user inputs a `macrocategory`, `productSearchSFRouter` routes it to the next slot to fill (i.e. `category` => `categorySF` function)

**Kind**: exported