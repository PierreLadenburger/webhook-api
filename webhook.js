var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');

app.use(bodyParser.json());

const apiUrl = "http://51.38.234.54:8042";

function addSymptoms(dialogflowRequest, res) {
    var requestOptions = {
        uri: apiUrl + '/symptoms/',
        body: JSON.stringify(dialogflowRequest),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions, function(error, response) {
        console.log('RESPONSE:');
        console.log(response.body);
        var symptoms =JSON.parse(response.body)
        var answer = 'Vos symptômes sont: '
        for (var i = 0; i < symptoms.length; i++) {
            console.log(symptoms[i]);
            answer += symptoms[i];
            if (i < symptoms.length - 1){
                answer += ', ';
            }
            if (i == symptoms.length - 2) {
                answer += 'et '
            }
        }
        answer += ". Avez-vous d'autres symptômes? Si vous les avez tous listés, vous pouvez me demander de vous diagnostiquer."
        res.send(JSON.stringify({ 'fulfillmentText': answer}));
        return;
    })
}

function resetSession(dialogflowRequest, res) {
    var requestOptions = {
        uri: apiUrl + '/reset-session/',
        method: 'DELETE',
        qs: {
            'sessionId': dialogflowRequest.session
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(dialogflowRequest.sessionId);
    request(requestOptions, function(error, response) {
        var result;
        result = JSON.parse(response.body);
        var answer;
        if (result.error == undefined) {
            answer = "Votre session et vos symptômes ont bien été réinitialisés."
        }
        else {
            answer = "Vous ne m'avez renseigné aucun symptôme, je n'ai rien à réinitialiser."
        }
        res.send(JSON.stringify({ 'fulfillmentText': answer}));
        return;
    })
}


function diagnose(dialogflowRequest, res) {
    var requestOptions = {
        uri: apiUrl + '/diagnose/',
        method: 'GET',
        qs: {
            'sessionId': dialogflowRequest.session
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions, function(error, response) {
        console.log ("============ THE DOCTOR SAID ============")
        console.log(response.body);
        var result;
        result = JSON.parse(response.body);
        var answer;
        if (result.error != undefined) {
            answer = "Vous ne m'avez renseigné aucun symptôme, je ne peux pas vous diagnostiquer."
        }
        else {
            answer = "Vous avez possiblement " + result.pronom + " " + result.nom + ". Si vous voulez en savoir plus sur cette maladie, demandez moi. Vous pouvez me lister d'autres symptômes si vous en avez oublié, ou vous pouvez me demander de les réinitialiser.";
        }
        res.send(JSON.stringify({ 'fulfillmentText': answer}));
        return;
    })
}

function learnMore(dialogflowRequest, res) {
//    console.log(dialogflowRequest.result.parameters.Maladies)
    var requestOptions = {
        uri: apiUrl + '/sickness/',
        body: JSON.stringify(dialogflowRequest),
        method: 'GET',
        qs: {
            'sickness_name' : dialogflowRequest.queryResult.parameters.Maladies
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions, function(error, response) {
        console.log(error, response.body);
        var result;
        result = JSON.parse(response.body);
        for (var i = 0; i < result.length; i++) {
            console.log(result[i]);
            res.send(JSON.stringify({ 'fulfillmentText': result[i].description, 'payload': {'google': {'expectUserResponse': true, 'richResponse': {'items': [{'simpleResponse': {'textToSpeech': result[i].description}}, {'basicCard': {'title': result[i].nom.replace(/(\b\w)/gi,function(m){return m.toUpperCase();}), 'image': { 'url': 'http://eip.epitech.eu/2020/homedoc/img/logo.png',
                                        'accessibilityText' : 'LOGO GOOGLE', 'height': 650}, 'buttons': [{'title': 'Voir la fiche', 'openUrlAction': {'url': 'http://eip.epitech.eu/2020/homedoc/img/resultat.png'}}], 'imageDisplayOptions': 'WHITE'}}]}}}}));
        }
        return;
    })
}

function callDoctor(dialogflowRequest, res) {
    var requestOptions = {
        uri: "https://api.homedoc.fr/getConnectedDoctors",
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions, function(error, response) {
        console.log('RESPONSE:');
        var result = JSON.parse(response.body);
        console.log(result.connected.length);
        var items = [];
        for (var i = 0; i < result.connected.length; i++) {

            items.push({
                optionInfo: {
                    "key": result.connected[i]._id,
                    "synonyms": [
                    ]
                },
                description: "test",
                image: {
                    "url": "https://www.homedoc.fr/icone_docteur.png",
                    "accessibilityText": "Image alternate text"
                },
                title: "Docteur " + result.connected[i].lastname + " " + result.connected[i].firstname
            });
        }
        res.send(JSON.stringify({
            "payload": {
                "google": {
                    "expectUserResponse": true,
                    "systemIntent": {
                        "intent": "actions.intent.OPTION",
                        "data": {
                            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
                            "listSelect": {
                                "items": items
                            }
                        }
                    },
                    "richResponse": {
                        "items": [
                            {
                                "simpleResponse": {
                                    "textToSpeech": "Voici une liste de médecins disponibles"
                                }
                            }
                        ]
                    }
                }
            }



        }))
    });

}

app.post('/webhook', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.queryResult.intent.displayName === "add_symptoms") {
        addSymptoms(req.body, res);
    }
    else if (req.body.queryResult.intent.displayName === "diagnose") {
        diagnose(req.body, res);
    }
    else if (req.body.queryResult.intent.displayName === "reset_session") {
        resetSession(req.body, res);
    }
    else if (req.body.queryResult.intent.displayName === "learn_more") {
        learnMore(req.body, res);
    }
    else if (req.body.queryResult.intent.displayName === "call_doctor") {
        callDoctor(req.body, res);
    }
    else if (req.body.queryResult.intent.displayName === "test") {
        res.send(JSON.stringify({ 'fulfillmentText': "D'accord nous allons essayer de vous mettre en relation avec le " + req.body.queryResult.outputContexts[2].parameters.text}));
    }
    else
        res.send(JSON.stringify({ 'fulfillmentText': "unknown intent"}));
});


app.listen(8081);