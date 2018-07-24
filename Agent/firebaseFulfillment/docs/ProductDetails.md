<a name="ProductDetails"></a>

## ProductDetails ⇐ productdetails.js

Product details (and followups) handlers

* Functions
    * Handlers
        * [productDetailsHandler](#productDetailsHandler)
        * [productDetailsColorHandler](#productDetailsColorHandler)
        * [productDetailsSizeHandler](#productDetailsSizeHandler)
        * [productDetailsPriceHandler](#productDetailsPriceHandler)
        * [productDetailsReviewHandler](#productDetailsReviewHandler)
        * [productDetailsMaterialHandler](#productDetailsMaterialHandler)
        * [productDetailsFallbackHandler](#productDetailsFallbackHandler)
    * Utilities
        * [printProductDetailsSuggestions](#printProductDetailsSuggestions)
        * [getSelectedProductID](#getSelectedProductID)
        * [getSizeChart](#getSizeChart)
        * [printSizeList](#printSizeList)

## Handlers

<a name="productDetailsHandler"></a>

### productDetailsHandler
Product details entry point: return general details for the selected product.

**Kind**: exported

<a name="productDetailsColorHandler"></a>

### productDetailsColorHandler
Return all available colors and related images for the selected product.

**Kind**: exported

<a name="productDetailsSizeHandler"></a>

### productDetailsSizeHandler
Return all available sizes for the selected product or states if the selected product is available in the selected size if the user specified a proper size.

**Kind**: exported

<a name="productDetailsPriceHandler"></a>

### productDetailsPriceHandler
Return the selected product price.

**Kind**: exported

<a name="productDetailsReviewHandler"></a>

### productDetailsReviewHandler
Return the selected product review (if available).

**Kind**: exported

<a name="productDetailsMaterialHandler"></a>

### productDetailsMaterialHandler
Return the selected product material (if available).

**Kind**: exported

<a name="productDetailsFallbackHandler"></a>

### productDetailsFallbackHandler
Handle the fallback for the productDetails context.

**Kind**: exported

## Utility

<a name="printProductDetailsSuggestions"></a>

### printProductDetailsSuggestions
Print the suggestions to get detailed info about a product. This is a recurrent operation, so it is handled by a specific function in order to keep the code DRY.

**Kind**: not exported 

| Param | Type | Description |
| --- | --- | --- |
| product | <code>object</code> | the product of reference about which the proper suggestions must be printed |
| exclusion | <code>string</code> | the suggestion to be excluded since it is the current visualization |

**Example**  
```js
// Since I currently am visualizing the available sizes for a given product
// => I don't want to print the 'Size' suggestion

let exclusion = 'Size'; 

printProductDetailsSuggestions(product, exclusion)
```
<a name="getSelectedProductID"></a>

### getSelectedProductID
Return the product ID of a product that has been selected within a carousel. The function retrieves the selection and the corresponding product ID directly parsing the JSON request.

**Kind**: not exported 

**Example**  
```js
let id = getSelectedProductID()
```
<a name="getSizeChart"></a>

### getSizeChart
Statically print the size chart card link for the current gender. This is a recurrent operation, so it is handled by a specific function in order to keep the code DRY.

**Kind**: not exported

**Example**  
```js
getSizeChart()
```
<a name="printSizeList"></a>

### printSizeList
Print all available sizes and the size chart

**Kind**: not exported

| Param | Type | Description |
| --- | --- | --- |
| sizes | <code>array</code> | the array of sizes to be printed |

**Example**  
```js
printSizeList(sizes)
```