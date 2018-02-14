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

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);


bot.dialog('/', [
    function(session){

        //session.say("We have great event to show you", "We have great event to show you")}
        
        builder.Prompts.text(session, 'We have great event to show you, please select Event 1 or Event 2', {            
            speak: 'We have great event to show you, please select Event 1 or Event 2',
            inputHint: builder.InputHint.expectingInput
        });

        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel);
        msg.attachments([
        new builder.HeroCard(session)
            .title("Events")
            //.inputHint(builder.InputHint.expectingInput)
            //.speak("test")
            //.images([builder.CardImage.create(session, "https://raw.githubusercontent.com/bilalghalayini/Vodafone-Chatbot/master/images/logo.png?token=AXIODsyktXd23aO41pFgxn2ISGc41rMcks5afEuHwA%3D%3D")])
            
            .buttons([
                builder.CardAction.imBack(session, "Opening", "Opening"),
                builder.CardAction.imBack(session, "Closing","Closing")
            ])
        ]);
        builder.Prompts.choice(session, msg, "Opening|Closing");
        
    }
    /*,

    function(session){
        var x = results.response;
        session.say("You have selected " + x + ", this event will take place tomorrow at 12 pm", "You have selected " + x + ", this event will take place tomorrow at 12 pm")
       /* builder.Prompts.text(session, 'Are you sure that you want to cancel this transaction?', {            
            speak: 'Are you sure that you want to cancel this transaction?',
            inputHint: builder.InputHint.expectingInput
        });
        
*/
        
    },




    function (session, results) {
        var x = results.response;
        session.say(x, "welcome " + x)}*/
   
]   // session.send('You said ' + session.message.text);
); 

/*
bot.dialog("testing",[function(session,args){
     
    builder.Prompts.text(session, 'Please choose what language do you want', {            
        speak: 'Please choose what language do you',
        inputHint: builder.InputHint.expectingInput
    });

    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
    new builder.HeroCard(session)
        .title("Vodafone Qatar")
        .text("Welcome to Vodafone Qatar chatbot")
        //.inputHint(builder.InputHint.expectingInput)
        //.speak("test")
        .images([builder.CardImage.create(session, "https://raw.githubusercontent.com/bilalghalayini/Vodafone-Chatbot/master/images/logo.png?token=AXIODsyktXd23aO41pFgxn2ISGc41rMcks5afEuHwA%3D%3D")])
        
        .buttons([
            builder.CardAction.imBack(session, "English", "English"),
            builder.CardAction.imBack(session, "Arabic","Arabic")
        ])
    ]);
    builder.Prompts.choice(session, msg, "Arabic|English");

}]) 
*/

bot.on("event", function (event) {
    //bot.beginDialog(event.address, 'testing');
   
   /* 
     var reply = new builder.Message()
    .address(event.address)
    .text("Welcome Prime Minister, How may i help you?")
    .speak("Welcome Prime Minister, How may i help you?")
    .inputHint(builder.InputHint.expectingInput)
    bot.send(reply);
    */

})

const createEvent = (eventName, value, address) => {
    var msg = new builder.Message().address(address);
    msg.data.type = "event";
    msg.data.name = eventName;
    msg.data.value = value;
    return msg; 
}