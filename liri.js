//Basic Node js application

var config = require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var fs = require('fs');
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");
// Then run a request to the OMDB API with the movie specified

if (process.argv[2] === 'my-tweets') {
    //show you at leasr the last 20 tweets
    var params = {
        q: '#nodejs, #Nodejs', //search query
        count: 20, //number of tweets to return
        screen_name: 'nodejs',
        result_type: 'recent', //shows recent tweets
        lang: 'en' //language English
    };
    console.log(params);
    client.get('search/tweets', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.statuses.length; i++) {
                var id = { id: tweets.statuses[i].id_str };
                var text = { text: tweets.statuses[i].text};
                console.log('recent tweets: ' + id['id'] + 'tweet: ' + text['text']);
            }
        } else {
            console.log(error);
        }
    });
}
else if (process.argv[2] === 'spotify-this-song') {
    spotify.search({ type: 'track', query: 'All the Small Things' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data);

        var fs = require('fs');

        var allLines = fs.readFileSync('random.txt').toString().split('\n');

        for (let j = 0; j < process.argv.length; j++) {

            console.log(process.argv[j]);
            if (j !== 0 && j !== 1) {
                allLines.foreach(function (line) {
                    var newLine = line + process.argv[j];
                    console.log(newLine);
                    fs.appendFileSync("random.txt", newLine.toString() + "\n");
                });
            }
        };
    });
}
else if (process.argv[2] === 'movie-this') {
    
}
else if (process.argv[2] === 'do-what-it-says') {
    
    if (process.argv[3] !== '') {
        fs.readFile('random.txt');
    }
    else {
        //search of Mr. Nobody movie
    }
}

