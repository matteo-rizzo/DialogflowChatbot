# Dialogflow Webhook Fulfillment 

Custom Firebase function fulfillment for a shopping assistant Dialogflow agent.

## Getting Started

### Prerequisites

* [Install the Firebase CLI](https://firebase.google.com/docs/cli/#setup).
* [Import](https://dialogflow.com/docs/agents#export_and_import) the agent provided in this repo
* Get your Google Project ID from the General tab of your [agent's settings](https://dialogflow.com/docs/agents#settings).

### Deploy your function with the Firebase CLI

```
Note: Deploying via the Firebase CLI will disable your ability to edit your fulfillment via the code editor, for this agent.
```

The following procedure is based on Dialogflow [official docs](https://dialogflow.com/docs/how-tos/getting-started-fulfillment): 

* Open a terminal or shell and navigate to the "functions" directory inside the repo. For example, cd `~/some/path/firebaseFulfillment/firebase/functions`.
* Run `npm install` to install all of your functions' dependencies
* Run the command `firebase login` and login to the Google account associated with your agent and allow the Firebase CLI to manage your Cloud and Firebase Projects.
* Run the command `firebase init`. 
* When prompted for feature selection choose `Functions`. 
* When prompted for a Firebase Project, select the Cloud Project ID found in your Dialogflow agent's settings.
* Deploy your Cloud Function for Firebase with `firebase deploy --only functions:dialogflowFirebaseFulfillment`
* Copy the Function URL after deployment (may take a minute or two) and paste it in your Dialogflow agent's fulfillment in the console

## Add a new intent webhook fulfillment

Intent and functions that fulfill them are mapped in the `index.js` file (the Firebase function entry point). If you want to extend the agent with new intents that need a webhook fulfillment you need to create a new function handler and map it to the right intent. See the following example:

```js
// ./index.js

let intentMap = new Map();
intentMap.set('someIntent', someIntentHandler);
agent.handleRequest(intentMap);
```

In order to keep the project organized, you're encouraged to create a new file for every new intent and to reference it inside `index.js`. Since the Dialogflow `agent` is a global variable, you can always reference it.


```
Note: Make sure to enable webhook fulfillment for your intent from the Dialogflow console so that the webhook is properly triggered.
```

## Built With

* [Dialogflow](https://dialogflow.com/) - NLU module and bot development framework
* [Node.js](https://nodejs.org/it/) - JS runtime
* [commercecloud-ocapi-client](https://github.com/mobify/commercecloud-ocapi-client) - Salesforce Commerce Cloud Open Commerce API (OCAPI) for Node and browsers.

## Authors

**Matteo Rizzo**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details