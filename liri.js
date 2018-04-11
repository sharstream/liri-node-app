require("dotenv").config();

var myKeys = require('./keys.js');

spotify.search({ type: 'track', query: 'All the Small Things' }, function (err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }

    console.log(data);
});

var stream = client.stream('statuses/filter', { track: 'javascript' });
stream.on('data', function (event) {
    console.log(event && event.text);
});

stream.on('error', function (error) {
    throw error;
});

// You can also get the stream in a callback if you prefer. 
client.stream('statuses/filter', { track: 'javascript' }, function (stream) {
    stream.on('data', function (event) {
        console.log(event && event.text);
    });

    stream.on('error', function (error) {
        throw error;
    });
});