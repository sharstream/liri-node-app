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
    var allLines = fs.readFileSync('random.txt').toString().split('\n');
    console.log('allLines: ' + allLines);
    var song = process.argv[3];
    if (song !== '') {
        spotify
            .search({ type: 'track', query: 'All the Small Things', limit: 1 })
            .then(function (data, response) {
                // console.log(JSON.stringify(data, null, 2));
                console.log('length: ' + data.tracks.items.length);
                for (let i = 0; i < data.tracks.items.length; i++) {
                    const element = data.tracks.items[i];
                    console.log('Artist(s): ' + element.album.artists[0].name);
                    console.log("The song's name is: " + element.name);
                    console.log('A preview link of the song from Spotify is: ' + element.preview_url);
                    console.log('The album name is: ' + element.album.name);
                    fs.appendFileSync("random.txt", 'spotify-this-song' + ', ' + element.name + "\n");
                }
            })
            .catch(function (err) {
                console.log('Error occurred: ' + err);
            }); 
    }
    else {
        spotify
            .search({ type: 'track', query: 'The Sign', limit: 1 })
            .then(function(data, response){
                const element = data.tracks.items[0];
                console.log('Artist(s): ' + element.album.artists[0].name);
                console.log("The song's name is: " + element.name);
                console.log('A preview link of the song from Spotify is: ' + element.preview_url);
                console.log('The album name is: ' + element.album.name);
                fs.appendFileSync("random.txt", 'spotify-this-song' + ', ' + element.name + "\n");
            })
            .catch(function(err){
                console.log('Error occurred: ' + err);
            })
    }
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

