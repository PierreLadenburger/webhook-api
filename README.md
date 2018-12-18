# webhook

V1: req.body.result.metadata.intentName == 'add_symptoms'
V2: req.body.queryResult.intent.displayName == 'add_symptoms'

V1 : res.send(JSON.stringify({ 'speech': "marche", 'displayText': response.body}));
V2 : res.send(JSON.stringify({ 'fulfillmentText': answer}));

V1:  'sickness_name' : dialogflowRequest.result.parameters.Maladies
V2:  'sickness_name' : dialogflowRequest.queryResult.parameters.Maladies

V1:  res.send(JSON.stringify({ 'speech': result[i].description, 'displayText': result[i].description, 'data': {'google': {'expectUserResponse': true, 'richResponse': {'items': [{'simpleResponse': {'textToSpeech': result[i].description}}, {'basicCard': {'title': result[i].nom.replace(/(\b\w)/gi,function(m){return m.toUpperCase();}), 'image': { 'url': 'http://eip.epitech.eu/2020/homedoc/img/logo.png',
        'accessibilityText' : 'LOGO GOOGLE', 'height': 650}, 'buttons': [{'title': 'Voir la fiche', 'openUrlAction': {'url': 'http://eip.epitech.eu/2020/homedoc/img/resultat.png'}}], 'imageDisplayOptions': 'WHITE'}}]}}}}));V1:  res.send(JSON.stringify({ 'fulfillmentText': result[i].description, 'payload': {'google': {'expectUserResponse': true, 'richResponse': {'items': [{'simpleResponse': {'textToSpeech': result[i].description}}, {'basicCard': {'title': result[i].nom.replace(/(\b\w)/gi,function(m){return m.toUpperCase();}), 'image': { 'url': 'http://eip.epitech.eu/2020/homedoc/img/logo.png',
                                        'accessibilityText' : 'LOGO GOOGLE', 'height': 650}, 'buttons': [{'title': 'Voir la fiche', 'openUrlAction': {'url': 'http://eip.epitech.eu/2020/homedoc/img/resultat.png'}}], 'imageDisplayOptions': 'WHITE'}}]}}}}));
V2:  res.send(JSON.stringify({ 'fulfillmentText': result[i].description, 'payload': {'google': {'expectUserResponse': true, 'richResponse': {'items': [{'simpleResponse': {'textToSpeech': result[i].description}}, {'basicCard': {'title': result[i].nom.replace(/(\b\w)/gi,function(m){return m.toUpperCase();}), 'image': { 'url': 'http://eip.epitech.eu/2020/homedoc/img/logo.png',
                                        'accessibilityText' : 'LOGO GOOGLE', 'height': 650}, 'buttons': [{'title': 'Voir la fiche', 'openUrlAction': {'url': 'http://eip.epitech.eu/2020/homedoc/img/resultat.png'}}], 'imageDisplayOptions': 'WHITE'}}]}}}}));