const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

const SpotifyWebApi = require('spotify-web-api-node');

module.exports = function() {
    this.spotifyApi = new SpotifyWebApi({
        clientId: config.spotify.clientID,
        clientSecret: config.spotify.clientSecret
    });

    this.getAccessToken = function() {
        return new Promise((resolve, reject) => {
            this.spotifyApi.clientCredentialsGrant().then(
                (data) => {
                    // data.body['expires_in']
                    this.spotifyApi.setAccessToken(data.body['access_token']);
                    resolve();
                },
                (err) => {
                    reject(err.message);
                }
            );
        });
    }

    this.getTrack = function(trackID) {
        return new Promise((resolve, reject) => {
            this.getAccessToken().then(() => {
                this.spotifyApi.getTrack(trackID).then(data => {
                    let trackInfo = data.body;
                    let name = trackInfo.name;
                    let artist = trackInfo.artists[0].name || 'Unknown';
                    let duration_ms = trackInfo.duration_ms;
                    let popularity = trackInfo.popularity;
    
                    this.spotifyApi.getAudioFeaturesForTrack(trackID).then(data => {
                        let audioFeatures = data.body;
                        let acousticness = audioFeatures.acousticness;
                        let danceability = audioFeatures.danceability;
                        let energy = audioFeatures.energy;
                        let instrumentalness = audioFeatures.instrumentalness;
                        let liveness = audioFeatures.liveness;
                        let loudness = audioFeatures.loudness;
                        let speechiness = audioFeatures.speechiness;
                        let valence = audioFeatures.valence;
                        let tempo = audioFeatures.tempo;
                        let key = audioFeatures.key;
    
                        let trackData = {
                            track_id: trackID,
                            name: name,
                            artist: artist,
                            duration_ms: duration_ms,
                            popularity: popularity,
                            acousticness: acousticness,
                            danceability: danceability,
                            energy: energy,
                            instrumentalness: instrumentalness,
                            liveness: liveness,
                            loudness: loudness,
                            speechiness: speechiness,
                            valence: valence,
                            tempo: tempo,
                            key: key
                        };

                        resolve(trackData);
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
}