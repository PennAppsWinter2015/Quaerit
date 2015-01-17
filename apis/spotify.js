var api = {}

var SpotifyWebApi = require('spotify-web-api-node');


var spotifyApi = new SpotifyWebApi();
api.trackSearch = {}
api.trackSearch.phrases = ['music by', 'artist', 'singer', 'songwriter', 'songs by'];

api.trackSearch.call_api = function(rawSearchText, callback) {
  for (var i = 0; i < api.trackSearch.phrases.length; i++) {
    rawSearchText = rawSearchText.replace(api.trackSearch.phrases[i], '')
  };
  spotifyApi.searchTracks('artist:' + rawSearchText.trim())
    .then(function(data) {
  callback(data)
    }, function(err) {
      console.error(err);
    });
}

api.playlistSearch = {}
api.playlistSearch.phrases = ['playlists', 'playlist'];

api.playlistSearch.call_api = function(rawSearchText, callback) {
  for (var i = 0; i < api.playlistSearch.phrases.length; i++) {
    rawSearchText = rawSearchText.replace(api.playlistSearch.phrases[i], '')
  };
  spotifyApi.searchPlaylist(rawSearchText.trim())
    .then(function(data) {
  callback(data)
    }, function(err) {
      console.error(err);
    });
}

var AuthenticationRequest = require('spotify-web-api-node/src/authentication-request'),
    WebApiRequest = require('spotify-web-api-node/src/webapi-request'),
    HttpManager = require('spotify-web-api-node/src/http-manager'),
    PromiseImpl = require('spotify-web-api-node/node_modules/promise');

function _addAccessToken(request, accessToken) {
  if (accessToken) {
    request.addHeaders({
      'Authorization' : 'Bearer ' + accessToken
    });
  }
}


  function _addQueryParameters(request, options) {
    if (!options) {
      return;
    }
    for (var key in options) {
      if (key !== 'credentials') {
        request.addQueryParameter(key, options[key]);
      }
    }
  }

  function _performRequest(method, request) {
    var promiseFunction = function(resolve, reject) {
      method(request, function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    };
    return new PromiseImpl(promiseFunction);
  }

SpotifyWebApi.prototype.searchPlaylist = function(query, options, callback) {
    var request = WebApiRequest.builder()
      .withPath('/v1/search/')
      .withQueryParameters({
        type : 'playlist',
        q : query
      })
      .build();

    _addAccessToken(request, this.getAccessToken());
    _addQueryParameters(request, options);

    var promise = _performRequest(HttpManager.get, request);

    if (callback) {
      promise.then(function(data) {
        callback(null, data);
      }, function(err) {
        callback(err);
      });
    } else {
      return promise;
    }
  };

module.exports = api;