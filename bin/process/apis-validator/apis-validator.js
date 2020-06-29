const __app = require('./app.global');

const apis = [
    {
        name: 'Api Sites',
        url: 'api/sites'
    },
    {
        name: 'Default',
        url: 'api/prod_related/product_num/equal_to/7'
    },
    {
        name: 'Default',
        url: 'api/dbqs_products_site_lang_ocasions/CO/1/es'
    },
    {
        name: 'Default',
        url: 'api/cities/cities_shipping/CO/1'
    },
    {
        name: 'Default',
        url: 'api/best_sellers_lang/site_num/equal_to/1'
    }
];

const requestValidator = {
    init: () => {
        __app.init();
        requestValidator.validate();
    },
    validate: () => {
        apis.forEach((api) => {
            __app.get(api.url).success(data => {
                if (data.code >= 0) {
                    requestValidator.printSucces(`✅  Ok - Request ${api.name} = ${api.url} runing...`);
                }
            }).error(error => {
                requestValidator.printError(`Error - Request ${api.name} = ${api.url} not response.`);
            }).send();
        });
    },
    printSucces: (message) => {
        console.log('\x1b[32m%s\x1b[0m', message);
    },
    printError: (message) => {
        console.log('\x1b[41m%s\x1b[0m', message);
    }
};

requestValidator.init();