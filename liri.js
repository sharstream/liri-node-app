//Basic Node js application

var config = require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);
var Omdb = require('omdb');
var omdb = new Omdb(keys.omdb);

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
    // API URL: http://www.omdbapi.com/?i=tt3896198&apikey=omdb
    if (process.argv[3] !== '') {
        omdb.search('saw', function (err, movies) {
            if (err) {
                return console.error(err);
            }

            if (movies.length < 1) {
                return console.log('No movies were found!');
            }

            movies.forEach(function (movie) {
                // * Title of the movie.
                // * Year the movie came out.
                // * IMDB Rating of the movie.
                // * Rotten Tomatoes Rating of the movie.
                // * Country where the movie was produced.
                // * Language of the movie.
                // * Plot of the movie.
                // * Actors in the movie.

                console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
                console.log('Rooten Tomatoes %d/10', movie.tomatoRating);
                console.log('country(%s) and language(%d)', movie.Country, movie.language);
                console.log(movie.plot);
                console.log('actors: ', movie.Actors);
            });
        });
    } else {
        omdb.get({ title: 'Mr. Nobody.', year: 2009 }, true, function (err, movie) {
            if (err) {
                return console.error(err);
            }

            if (!movie) {
                return console.log('Movie not found!');
            }

            console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
            console.log('Rooten Tomatoes %d/10', movie.tomatoRating);
            console.log('country(%s) and language(%d)', movie.Country, movie.language);
            console.log(movie.plot);
            console.log('actors: ', movie.Actors);

            // Mr. Nobody. (2009) 7.9/10
            // Mr. Nobody tells the life story of Nemo...
        });
    }
}
else if (process.argv[2] === 'do-what-it-says') {
    
    if (process.argv[3] !== '') {
        fs.readFile('random.txt');
    }
    else {
        //search of Mr. Nobody movie
    }
}

