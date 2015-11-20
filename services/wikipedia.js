angular
  .module('age-calculator')
  .factory('wikipedia', function($http) {
    return {
      getBirthDate : function(name) {
        var url = 'https://en.wikipedia.org/w/api.php?format=json&utf8=&callback=JSON_CALLBACK&action=query&prop=revisions&rvprop=content&rvsection=0&redirects=&titles=';
        var encodedName = name.replace(' ', '%20');
        return $http.jsonp(url + encodedName)
        .then(function success(response) {
          return response.data;
        }, function error(response) {
          console.log(response);
        });
      }
    }
  });