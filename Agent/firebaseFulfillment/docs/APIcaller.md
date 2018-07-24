<a name="APIcaller"></a>

## APIcaller ⇐ apicaller.js

Open Commerce API (OCAPI) calls using commercecloud-ocapi-client

See the following docs for reference:
https://mobify.github.io/commercecloud-ocapi-client/

* Functions
    * [getOCAPIconfig](#getOCAPIconfig)
    * [callCategoriesApi](#callCategoriesApi)
    * [callProductSearchApi](#callProductSearchApi)
    * [callProductsApi](#callProductsApi)

<a name="getOCAPIconfig"></a>

### getOCAPIconfig
Return OCAPI authentication and configuration

**Kind**: not exported

<a name="callCategoriesApi"></a>

### callCategoriesApi
Call demandware API via commercecloud-ocapi-client to retrieve category data

**Kind**: exported 

| Param | Type | Description |
| --- | --- | --- |
| category | <code>string</code> | category ID |
| levels | <code>number</code> | category nesting level |

**Example**  
```js
let category = 'uomo-scarpe-sportswear';
let levels = 1;

return APIcaller.callCategoriesApi(category, levels)
    .then((category) => {
        ...
    })).catch((err) => {
        ...
    }

```
<a name="callProductSearchApi"></a>

### callProductSearchApi
Call demandware API via commercecloud-ocapi-client to retrieve products general data

**Kind**: exported 

| Param | Type | Description |
| --- | --- | --- |
| searchParameters | <code>SearchParameters</code> | search parameters for the API query |

**Example**  
```js
let searchParameters = new SearchParameters();

return APIcaller.callProductSearchApi()
    .then((products) => {
        ...
    })).catch((err) => {
        ...
    }
```
<a name="callProductsApi"></a>

### callProductsApi
Call demandware API via commercecloud-ocapi-client to retrieve product details

**Kind**: exported

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the id of the product to be searched |
| allImages | <code>boolean</code> | flag to expand all available images in the API response  |

**Example**  
```js
let id = '123.45678_910';
let allImages = true;

return APIcaller.callProductsApi(id, allImages)
    .then((product) => {
        ...
    })).catch((err) => {
        ...
    }
```