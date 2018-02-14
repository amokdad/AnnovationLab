/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});
 



// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

var englishRecognizer = new builder.RegExpRecognizer( "English", /(English)/i),

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

var intents = new builder.IntentDialog({ recognizers: [
    englishRecognizer
    ] 
})

.matches('English',(session, args) => {
    // session.send('English');
    session.say("Okay Thanks");
})

bot.dialog('/', [
    function(session){
        
        builder.Prompts.text(session, 'Please choose what language do you want', {            
            speak: 'Please choose what language do you want',
            inputHint: builder.InputHint.expectingInput
        });

        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel);
        msg.attachments([
        new builder.HeroCard(session)
            .title("Vodafone Qatar")
            .text("Welcome to Vodafone Qatar chatbot")
            .buttons([
                builder.CardAction.imBack(session, "English", "English"),
                builder.CardAction.imBack(session, "Arabic","Arabic")
            ])
        ]);
        builder.Prompts.choice(session, msg, "Arabic|English");
    },

    function(session){



        
        builder.Prompts.text(session, 'Are you sure that you want to cancel this transaction?', {            
            speak: 'Are you sure that you want to cancel this transaction?',
            inputHint: builder.InputHint.expectingInput
        });
    },




    function (session, results) {
        var x = results.response;
        session.say(x, "welcome " + x)}
   
]   // session.send('You said ' + session.message.text);
); 


/*

bot.on('conversationUpdate', function(message) {
    // Send a hello message when bot is added
    if (message.membersAdded) {
        message.membersAdded.forEach(function(identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                .address(message.address)
                .text("Hi! What language would you like to Use")
                .speak("Testing")
                bot.send(reply);

                var reply = createEvent("startRecording", {}, message.address);
                bot.send(reply);
            }
        });
    }
});
*/

bot.on("event", function (event) {

    var reply = new builder.Message()
    .address(event.address)
    .text("Welcome Prime Minister, How may i help you?")
    .speak("Welcome Prime Minister, How may i help you?")
    .inputHint(builder.InputHint.expectingInput)
    bot.send(reply);
 

})

const createEvent = (eventName, value, address) => {
    var msg = new builder.Message().address(address);
    msg.data.type = "event";
    msg.data.name = eventName;
    msg.data.value = value;
    return msg; 
}