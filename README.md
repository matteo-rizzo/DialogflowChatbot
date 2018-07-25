# DialogflowChatbot 

[![Build Status](https://travis-ci.com/MatteoRizzo96/DialogflowChatbot.svg?token=aob17sYb8dGQVTrvvHqE&branch=master)](https://travis-ci.com/MatteoRizzo96/DialogflowChatbot)

This is an Angular 6 front-end for a Dialogflow chatbot 🤖. You will find the bot and its webhook fulfillment in a dedicated [repo](https://github.com/MatteoRizzo96/DialogflowAgentFulfillment).

## 🙌 Getting started

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8. Notice that `index.js` is the express server meant to be used for local development, if you want to deploy the chatbot as a Node app in Firebase you want to deploy it as a Cloud Function for Firebase. You will find further information in a dedicated README.md in the `functions` folder. The `dialogflow-custom-client.js` is a customized interface for the official [Dialogflow client for Node.js](https://github.com/dialogflow/dialogflow-nodejs-client-v2).
 
### Prerequisites

First of all you need to install the dependencies. You can do that via [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/lang/en/), running one of the following command in the root directory:

```
> npm install
> yarn install
```

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## ✅ Running the tests

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## ❓ Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## 🚀 Deployment

The app may be deployed as a Node app on Firebase hosting. To deploy it in this way, please comply with the following instructions (in the root directory):
```
> firebase init hosting
> firebase deploy --only hosting
```
After the execution of the `firebase init hosting` command, a `firebase.json` will be created. Make sure it contains the proper rewrites for your backend, you will find further information about this in the [official Firebase docs](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-rewrites).
 
## ⚡ Built With

* [Dialogflow V2](https://dialogflow.com/) - NLU module and bot development framework
* [Pusher](https://pusher.com/) - Web socket manager
* [Angular](https://angular.io/) - Web app framework

## 😎 Authors

Matteo Rizzo

## 🎓 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 👥 Acknowledgments

This project is inspired by a [Pusher tutorial](https://pusher.com/tutorials/group-chat-angular-dialogflow).
