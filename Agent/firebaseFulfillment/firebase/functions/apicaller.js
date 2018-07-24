/**
 * Open Commerce API (OCAPI) calls using commercecloud-ocapi-client
 * 
 * See the following docs for reference:
 * https://mobify.github.io/commercecloud-ocapi-client/
 */

const ShopApi = require('commercecloud-ocapi-client');

// UTILITY - Return OCAPI authentication and configuration
function getOCAPIconfig() {

    // Default client ID for a sandbox, no need for further authentication
    // Notice: if you need prod authentication use oauth2 access token, see the docs for further info
    const clientId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    // Path to the sandbox
    const basePath = 'https://dev01-diana01-dianacorp.demandware.net/s/Diadora/dw/shop/v18_7';


    // Basic API client config
    const config = {
        basePath: basePath,
        defaultHeaders: {'x-dw-client-id': clientId}
    };

    return config;
}

// API FULFILLMENT - Call demandware API via commercecloud-ocapi-client to retrieve CATEGORY data
function callCategoriesApi(category, levels = 1) {

    console.log('APIcaller::callCategoriesApi');

    console.log('Searching for ' + category + "...");

    ShopApi.ApiClient.instance = new ShopApi.ApiClient(getOCAPIconfig());
    const categoriesApi = new ShopApi.CategoriesApi();

    const opts = {
        levels: levels,
        locale: 'it'
    };

    // Search the categories at the given level (opts) 
    return categoriesApi.getCategoriesByID(category, opts)
        .then((result) => {
            console.log('categories API call was successful.');
            console.log(`API response: \n ${JSON.stringify(result, null, 2)}`);

            let categories = [];

            // Get all the desired categories names
            for(let i in result.categories) {
                if(result.categories[i].name != 'New Arrivals' && result.categories[i].name != 'Collezioni')
                categories.push(result.categories[i].name);
            }

            console.log(`Avaible categories: \n ${JSON.stringify(categories, null, 2)}`);

            return Promise.resolve(categories);
        })
        .catch((fault) => {
            console.error(fault)
            return Promise.reject(result);
        });
}

// API FULFILLMENT - Call demandware API via commercecloud-ocapi-client to retrieve PRODUCTS general data
function callProductSearchApi(searchParameters) {

    console.log('APIcaller::callProductSearchApi');
    
    ShopApi.ApiClient.instance = new ShopApi.ApiClient(getOCAPIconfig());
    const productSearchApi = new ShopApi.ProductSearchApi();
    const productsApi = new ShopApi.ProductsApi();
    
    // Refinements
    let refine = ['cgid=' + searchParameters.getQuery().join("-")];
    if(searchParameters.color && searchParameters.color != 'undefined')
    refine.push('c_descrizioneColore=' + searchParameters.color.split(",").join("|"));

    console.log('Refinements ' + JSON.stringify(refine, null, 2));

    const opts = {
        count: 5,
        sort: 'top-sellers',
        refine: refine
    };

    // Search the products on the based of the query parameters (opts) 
    return productSearchApi.getProductSearch(opts)
        .then((result) => {
            console.log('productSearch API call was successful.');
            console.log(`API response: \n ${JSON.stringify(result, null, 2)}`);

            let products = [];
            let IDs = [];

            // Get all the desired products ID
            for(let i in result.hits) {
                IDs.push(result.hits[i].product_id);
            }

            // Get all the desired products by ID
            return productsApi.getProductsByIDs(IDs, {expand: ["images"], locale: 'it'})
                .then((products) => {
                    console.log('productsApi API call was successful.');
                    console.log(`API response: \n ${JSON.stringify(products, null, 2)}`);
                    return Promise.resolve(products.data);
                })
                .catch((fault) => {
                    console.error(fault);
                    return Promise.reject(products);
                });
        })
        .catch((fault) => {
            console.error(fault)
            return Promise.reject(result);
        });
}

// API FULFILLMENT - Call demandware API via commercecloud-ocapi-client to retrieve PRODUCT details
function callProductsApi(id, allImages = false) {

    console.log('APIcaller::callProductsApi');
    
    ShopApi.ApiClient.instance = new ShopApi.ApiClient(getOCAPIconfig());
    const productsApi = new ShopApi.ProductsApi();
    
    // Get the product details by id
    return productsApi.getProductsByID(id, {expand: ["images", "prices", "variations", "recommendations"], locale: 'it', allImages: allImages})
        .then((product) => {
            console.log('productsApi API call was successful.');
            console.log(`API response: \n ${JSON.stringify(product, null, 2)}`);
            return Promise.resolve(product);
        })
        .catch((fault) => {
            console.error(fault);
            return Promise.reject(product);
        });
}

module.exports = {
    callCategoriesApi: callCategoriesApi,
    callProductSearchApi: callProductSearchApi,
    callProductsApi: callProductsApi
};