"use strict";

const express = require("express");
const bodyParser = require("body-parser");
// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
var cors = require('cors');

const restService = express();
restService.use(cors());

restService.use(
    bodyParser.urlencoded({
        extended: true
    })
);

restService.use(bodyParser.json());

const projectId = 'chatdelivery-jumyxy';

//https://dialogflow.com/docs/agents#settings
// generate session id (currently hard coded)
const sessionId = '2eccb33b-8494-40dd-ac92-212972b9dbea';
const languageCode = 'pt-BR';


let privateKey = 'f4752c65e1c67de1b643e8d47a6d631039682ef4';

// as per goolgle json
let clientEmail = "dialogflow-hjkuax@chatdelivery-jumyxy.iam.gserviceaccount.com";
let config = {
    credentials: {
        private_key: privateKey,
        client_email: clientEmail
    }
}
const sessionClient = new dialogflow.SessionsClient(config);

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);



restService.post("/message", async function (req, res) {

    if(!req.body) return res.sendStatus(400);
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: req.body.messageText,
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    sessionClient
        .detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult;
            console.log(`  Response: ${result.fulfillmentText}`);

            return res.json({ messageResponse: result.fulfillmentText });
        })
        .catch(err => {
            return res.json({ messageResponse: "Intente novamente" });
        });

});

restService.listen(process.env.PORT ||  8000, function () {
    console.log("Server up and listening");
});