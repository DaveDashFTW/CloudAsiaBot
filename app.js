
var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
 appId: process.env.MICROSOFT_APP_ID,
 appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.send(new builder.Message()
					.address(message.address)
					.addAttachment({ name: "Telstra Logo", contentType: 'ímage/png', contentUrl: "http://cdn.downdetector.com/static/uploads/c/300/6e880/Telstra_logo.svg_1_1.png"})
                    .text("Hello!  I'm a Telstra Bot. To get started ask me some questions about Telstra Products and Services - for example - ask me for a service description"));
            }
        });
    }
});

//=========================================================
// Bots Dialogs
//=========================================================

var recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: 'd64d542d-50ed-4705-91c4-d7d669a19235', 
	subscriptionKey: 'fbb1f7214c464e3f8bbb7bb65713b937',
	top: 3});

var qnaMakerTools = new cognitiveservices.QnAMakerTools();
bot.library(qnaMakerTools.createLibrary());

var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers: [recognizer],
	defaultMessage: 'No match! Try changing the query terms!',
	qnaThreshold: 0.3,
	feedbackLib: qnaMakerTools
});

bot.dialog('/', basicQnAMakerDialog);