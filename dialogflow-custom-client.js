/**
 * src/dialogflow.js
 * 
 * @DialogFlow
 * 
 * A custom Dialogflow client which handles message exchange between Dialogflow itself and the Express middleware
 * 
 * @constructor : Constructs a DialogFlow object and handles authentication.
 * 
 * @createCardMessage : Creates a properly formatted dialogflow-fulfillment card based on the piece of Dialogflow response containing the card data.
 * @createQuickRepliesMessage : Creates an array of properly formatted dialogflow-fulfillment suggestions based on the piece of Dialogflow response containing the quick replies data.
 * @createCarouselMessage : Creates a properly formatted dialogflow-fulfillment cards array based on the piece of Dialogflow response containing the cards data.
 * @createResponseRouter : Utility method which Handles the proper dispatching of the message creation based on the message type reported in the Dialogflow JSON response.
 * @aggregateCards : Utility method which aggregates the card messages reported in the Dialogflow JSON response so that carousels can be properly handled.
 * @createWebhookResponse : Handles a webhook response creation, in particular the generation of properly formatted messages to be returned back to the chat.
 * @createSimpleResponse : Handles the creation of a non webhook response, which is simple text.
 * @sendTextMessageToDialogflow : Sends the user text query to Dialogflow and returns the response.
 * 
 * -- Offical DialogflowV2 Node.js client SDK for reference : https://github.com/dialogflow/dialogflow-nodejs-client-v2
 */

const dialogflow = require('dialogflow');
const {Card, Suggestion} = require('dialogflow-fulfillment');
require('dotenv').config();

const LANGUAGE_CODE = 'it' 

class DialogFlow {

	// CONSTRUCTOR

	/**
	 * Construct a DialogFlow object handling O2 authentication as well
	 * 
	 * @param  {string} projectId='conversational-ui-207612' : the Dialogflow agent Google Cloud project ID
	 */
	constructor (projectId = process.env.PROJECT_ID) {

		console.log('Auth config creation...');

		this.projectId = projectId;

		let privateKey =  process.env.DIALOGFLOW_PRIVATE_KEY;
		let clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
		}

		// Session creation
		this.sessionClient = new dialogflow.SessionsClient(config)

		console.log('Auth config successfully created!');
	}

	// RICH MESSAGES HANDLERS

	/**
	 * Create a properly formatted dialogflow-fulfillment card based on the piece of Dialogflow response containing the card data
	 * 
	 * @param  {object} cardcontent : the piece of Dialogflow response containing the card data
	 * @returns {Card} card : a properly formatted dialogflow-fulfillment card 
	 */
	createCardMessage(cardcontent) {

		console.log('createCardMessage');

		let card = new Card(cardcontent.title);

		if(cardcontent.subtitle && cardcontent.subtitle !== 'undefined')
		card.setText(cardcontent.subtitle);

		if(cardcontent.imageUri && cardcontent.imageUri !== 'undefined')
		card.setImage(cardcontent.imageUri)

		if(cardcontent.buttons.length > 0 && cardcontent.buttons !== 'undefined') {
			card.setButton({
				text: cardcontent.buttons[0].text,
				url: cardcontent.buttons[0].postback
			});
		}

		return card;
	}

	/**
	 * Create an array of properly formatted dialogflow-fulfillment suggestions based on the piece of Dialogflow response containing the quick replies data
	 * 
	 * @param  {object} replies : the piece of Dialogflow response containing the quick replies data
	 * @returns {object} quickReplies : an array of dialogflow-fulfillment Suggestions containing the quick replies 
	 */
	createQuickRepliesMessage(replies) {

		console.log('createQuickRepliesMessage');

		let quickReplies = [];
		for(var i in replies) {
			quickReplies.push(new Suggestion(replies[i]));
		}
		return quickReplies;
	}

	/**
	 * A carousel is meant as a sequence of cards displayed in a horizontal scroll layout.
	 * The function creates a properly formatted dialogflow-fulfillment cards array based on the piece of Dialogflow response containing the cards data
	 * 
	 * @param  {object} cards - the piece of Dialogflow response containing the cards data
	 * @returns {object} carousel - an array of dialogflow-fulfillment Cards representing the carousel 
	 */
	createCarouselMessage(cards) {

		console.log('createCarouselMessage');

		let carousel = [];
		for(var i in cards) {
			carousel.push(this.createCardMessage(cards[i].card));
		}
		return carousel;
	}
	
	// FULFILLMENT HANDLERS (WEBHOOK AND NON WEBHOOK)
	
	/**
	 * Utility method which Handles the proper dispatching of the message creation based on the message type reported in the Dialogflow JSON response
	 * 
	 * @param  {object} response - the piece of Dialogflow response to be properly decoded and formatted
	 * @param  {string} messageType - the formatting typology
	 */
	createResponseRouter(response, messageType) {

		console.log('createResponseRouter');

		switch(messageType) {
			case 'text':
				return response.text.text[0];
				break;
			case 'card':
				return this.createCardMessage(response.card);
				break;
			case 'quickReplies':
				return this.createQuickRepliesMessage(response.quickReplies.quickReplies);
			case 'carousel':
				return this.createCarouselMessage(response.carousel);
			default:
				throw 'Unknown message type!'
		}
	}
	
	/**
	 * Utility method which aggregates the card messages reported in the Dialogflow JSON response so that carousels can be properly handled.
	 * The function aggregates sequences of cards only. which means that a single card followed by a non card message and then by another card
	 * will result in single cards display (as expected)
	 * 
	 * @param  {object} response - a properly ordered object with aggregated cards
	 */
	aggregateCards(response) {

		console.log('aggregateCards');

		// Non carousel messages
		var messages = [];
		// Carousel messages
		var carousel = {"carousel": []};

		for(let i = 0; i < response.length; i++) {
			// If the current message is a card && the previous || the next message is a card as well => this is a carousel
			if(response[i].hasOwnProperty('card') && ((response[i-1] && response[i-1].hasOwnProperty('card')) || (response[i+1] && response[i+1].hasOwnProperty('card')))) {
				carousel.carousel.push(response[i]);
			}
			else {
				messages.push(response[i]);
			}
		}

		if(carousel.carousel.length > 0)
		messages.push(carousel)

		return messages;
	}

	/** 
	 * Handle a webhook response creation, in particular the generation of properly formatted messages to be returned back to the chat
	 * 
	 * @param  {object} response - Dialogflow query result
	 * @returns {object} messages - array of potentially rich and multiple messages
	 */
	createWebhookResponse(response) {

		console.log('createWebhookResponse');

		// Array of messages to be returned
		var messages = [];
		// Current processing message 
		var message;
		// Array with all the possible message types
		var messageTypes = ['text', 'quickReplies', 'card', 'carousel'];
		// Current processing message typology
		var messageType;

		// Aggregate subsequent cards to properly handle carousel
		response = this.aggregateCards(response);

		console.log('Response:')
		
		// Iterate over Dialogflow webhook fulfillment messages
		for(let i in response) {
			// Look for the current message typology
			for(let j in messageTypes) {
				// If the right message type has been found => create response and stop iterating
				if(response[i].hasOwnProperty(messageTypes[j])) {
					message = this.createResponseRouter(response[i], messageTypes[j]);
					messageType = messageTypes[j];
					break;
				}
			}
			// Push the response in the array to be returned
			messages.push({
				channel: "chat-group",
				name: "chat",
				data: {
					message: message,
					messageType: messageType,
					displayName: 'Marcello',
					createdAt: new Date().toISOString()
				}
			});
			console.log(`Message #${i} - type: ${messageType}: ${JSON.stringify(message, null, 2)}`);
		}
	
		return messages;
	}

	/**
	 * Handle the creation of a non webhook response, which is simple text
	 * 
	 * @param  {string} textMessage - the text response to be included in the bot answer
	 */
	createSimpleResponse(textMessage) {

		console.log('createSimpleResponse');
		
		return [{ 
			channel: "chat-group",
			name: "chat",
			data: {
				message: textMessage,
				displayName: 'Marcello',
				createdAt: new Date().toISOString(),
				messageType: 'text'
			}
		}]	
	}

	/**
	 * Send the user text query to Dialogflow and returns the response
	 * 
	 * @param  {string} textMessage -  the user query
	 * @param  {string} sessionId=process.env.SESSION_ID - the current user session set as environmental variable
	 * @returns {object} fulfillment - the Dialogflow fulfillment to the user query  
	 */
	sendTextMessageToDialogFlow(textMessage, sessionId = process.env.SESSION_ID) {

		console.log('sendTextMessageToDialogFlow')

		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);

		// The text query request
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: LANGUAGE_CODE
				}
			}
		}

		// detectIntent sends the query to Dialogflow and retrieves a response
		return this.sessionClient.detectIntent(request).then((responses) => {

			console.log('Message sent successfully! Returning response...');
			console.log(`Dialogflow raw Response: ${JSON.stringify(responses, null, 2)}`);

			const response = responses[0].queryResult;

			// Query console log
			console.log(`Query: ${response.queryText}`);
			
			// Intent console log
			if (response.intent)
			console.log(`Intent: ${response.intent.displayName}`);
			else
			console.log(`No intent matched.`);

			// Tries to set fulfillment to non webhook basic text fulfillment
			let fulfillment = response.fulfillmentText;
			
			if(!fulfillment) {
				// If there's no basic text fulfullement => retrieve webhook fulfillment
				fulfillment = this.createWebhookResponse(response.fulfillmentMessages);
				console.log(`Response: ${JSON.stringify(fulfillment, null, 2)}`);
			}
			else {
				// Non webhook basic text fulfillment console log
				fulfillment = this.createSimpleResponse(fulfillment);
				console.log(`Response: ${JSON.stringify(fulfillment, null, 2)}`);
			}
				
			// Return bot answer
			return Promise.resolve(fulfillment);
			
		}).catch((err) => {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		});	
	}
}

module.exports = DialogFlow