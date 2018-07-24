// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  url: 'http://localhost:5000',
  pusher: {
    appId: '552173',
    key: '3de599a26e86c747bb15',
    secret: '2685bf7370160d5f7967'
  },
  dialogflow: {
    DianaAgent: '7aff5896b06c47059d35bb02f1119e4c'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.