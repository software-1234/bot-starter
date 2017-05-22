"use strict";

//setup / import libraries
const ApiAiAssistant = require("actions-on-google").ApiAiAssistant;
const express = require("express");
const bodyParser = require("body-parser");
const httpRequest = require("request-promise");  
require("string_score");
const utilities = require("./utilities.js"); //utility functions
const app = express();
app.set("port", (process.env.PORT || 8080));
app.use(bodyParser.json({type: "application/json"}));

//register an endpiont that will listen on http://localhost:8080/
app.post("/", function (request, response) {
  //Create an instance of API.AI assistant
  const assistant = new ApiAiAssistant({request: request, response: response});

  // **************************
  //    Welcome Action
  // **************************
  
  //action name for welcome
  const WELCOME_ACTION = "welcome";

  //handler function for welcome
  function handleWelcome (assistant) { //for Google Assistant only
    assistant.ask("Hi, I'm software summit bot - ask me a question!");
  }
  
  // **************************
  //  Summiteer Hometown Action
  // **************************

  //action name for hometown
  const HOMETOWN_ACTION = "hometown";

  //handler function for hometown
  function handleHometown(assistant) {
    //1. Declare argument constants for user input (first and last name of summiteer)
    const FIRST_NAME_ARG = "firstName";
    const LAST_NAME_ARG = "lastName";

    //2. Extract first and last name from assistant
    const firstName = assistant.getArgument(FIRST_NAME_ARG);
    const lastName = assistant.getArgument(LAST_NAME_ARG);
    
    //3. Obtain data for summiteer, generate speech, and reply to user
    const personData = utilities.findPersonData(firstName, lastName);

    let speech = "";

   if(personData && personData.hometown){
      const hometown = personData.hometown;
      speech = firstName + " is from " + hometown;
   }
   else {
      speech = "I wasn't able to find the hometown for " + firstName;
   }

   utilities.replyToUser(request, response, assistant, speech);
  }

  // **************************
  //    Summiteer Photo Action
  // **************************
  
  //action name for photo
  const PHOTO_ACTION = "photo";

  //handler function for photo
  function handlePhoto(assistant) {
    //1. Declare argument constants for user input (first and last name of summiteer)
    const FIRST_NAME_ARG = "firstName";
    const LAST_NAME_ARG = "lastName";

    //2. Extract first and last name from assistant
    const firstName = assistant.getArgument(FIRST_NAME_ARG);
    const lastName = assistant.getArgument(LAST_NAME_ARG);

    //3. Obtain data for summiteer, generate speech, and reply to user
    const personData = utilities.findPersonData(firstName, lastName);

    let speech = "";

    if(personData){
      const firstName = personData.nickname ? personData.nickname : personData.firstName;
      const photoUrl = "https://s3.amazonaws.com/softwaresummit/" + personData.lastName + "_" + firstName + ".jpg";
      speech = "Check out " + firstName + "'s beautiful face here: " + photoUrl;
    }
    else {
      speech = "I wasn\"t able to find a photo for " + firstName;
    }

    utilities.replyToUser(request, response, assistant, speech);
  }

  // **************************
  //  Summiteer Fun Fact Action
  // **************************

  //action name for fun fact

  //handler function for fun fact
  function handleFunFact(assistant) {
    //1. Declare argument constants for user input (first and last name of summiteer)

    //2. Extract first and last name from assistant
    
    //3. Obtain data for summiteer, generate speech, and reply to user

  }

  // **************************
  //  Summiteer Weather Action
  // **************************
  
  //action name for weather

  //handler function for weather
  function handleWeather(assistant) {
    //1. Declare argument constant for user input (day of week)

    //2. Extract day of week from the assistant

    //3. Make network request and speak result
    //(see gist https://gist.github.com/jaredalexander/4b69ae089666b0e220014507ce6662b2)
    
  }

  // **************************
  //  Metro Action
  // **************************

  //TODO: Declare action name for metro
  
  //TODO: Complete handler function for metro
  function handleMetro(assistant) {
    //1. TODO: Declare argument constants for user input (line color and direction)

    //2. TODO: Extract direction and line color from the assistant

    //3. TODO: Perform networking call to WMATA (Metro) API and speak result
    //(see gist https://gist.github.com/jaredalexander/3bb44e556d10d09501190b0b1794ab96)
  
  }

  //create a map of potential actions that a user can trigger
  const actionMap = new Map();

  //for each action, set a mapping between the action name and the handler function
  actionMap.set(WELCOME_ACTION, handleWelcome);
  actionMap.set(HOMETOWN_ACTION, handleHometown);
  actionMap.set(PHOTO_ACTION, handlePhoto);

  //register the action map with the assistant
  assistant.handleRequest(actionMap);
});

// Start the server on your local machine
const server = app.listen(app.get("port"), function () {
  console.log("App listening on port %s", server.address().port);
  console.log("Press Ctrl+C to quit.");
});