// src/server.js

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortId = require('shortid');
const Pusher = require('pusher');
const DialogFlow = require('./dialogflow-custom-client.js');
require('dotenv').config();

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a shared pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: 'eu',
  encrypted: true
})

// POST /message
app.post('/message', (req, res) => {

  console.log('Sending message to the bot...');

  // Cache control
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

  // Simulate actual db save with id and createdAt added
  const chat = Object.assign(req.body, {id: shortId.generate(), createdAt: new Date().toISOString()});
  
  // Trigger this update to our pushers listeners
  pusher.trigger('chat-group', 'chat', chat);

  // Build a Dialogflow sender
  const sender = new DialogFlow();
  // Retrieve the user query
  const message = chat.message;

  // Send the user query to Dialogflow
  return sender.sendTextMessageToDialogFlow(message).then((response) => {

    console.log('Response returned successfully!');
    
    // Trigger the bot response through Pusher in batch mode, which lets you handle multiple sending
    pusher.triggerBatch(response);
      
    // Send the bot response back to the chat
    res.send(chat);
  }).catch((err) => {
    console.log(err);
  });
})

// POST /join
app.post('/join', (req, res) => {
  
  console.log('Joining group...');

  // Cache control
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  
  const chat = Object.assign(req.body, {id: shortId.generate(), userType: 'joined', createdAt: new Date().toISOString()});

  // Trigger this update to our pushers listeners
  pusher.trigger('chat-group', 'chat', chat);

  // Build a Dialogflow sender
  const sender = new DialogFlow();

  // Initialize the bot
  sender.sendTextMessageToDialogFlow('ciao').then((response) => {

    console.log('Response returned successfully!');
    
    // Trigger the bot response through Pusher in batch mode, which lets you handle multiple sending
    pusher.triggerBatch(response);
      
    // Send the bot response back to the chat
    res.send(chat);
  }).catch((err) => {
    console.log(err);
  });

  res.send(chat);
})

// LISTEN
app.listen(process.env.PORT || 2000, () => console.log('Listening at 2000...'))

exports.app = functions.https.onRequest(app);