# Firebase backend

## What is it?
Cloud Functions for Firebase lets you automatically run backend code in response to events triggered by Firebase features and HTTPS requests. Your code is stored in Google's cloud and runs in a managed environment. There's no need to manage and scale your own servers.
More info can be found in the [official docs](https://firebase.google.com/docs/functions/).

## Getting started
The content of the `functions` folder is meant to be deployed as a Firebase function for a complete deploy of the app within Firebase hosting.

### How to deploy
In order to properly deploy the function, make sure to comply with the following instructions:

```
> firebase init functions
> firebase deploy --only app
```

Notice that the `firebase init functions` is only necessary once. Besides, make sure you use the `--only functiontobedeployed` notation: not using it will result in the deleting of all Cloud Functions for Firebase except the one you're deploying

