angular
  .module('age-calculator')
  .factory('wikipedia', function($http) {
    var url = 'https://en.wikipedia.org/w/api.php?format=json&utf8=&callback=JSON_CALLBACK&action=query&prop=revisions&rvprop=content&rvlimit=1&rvsection=0&titles=Albert%20Einstein';
    return {
      getBirthDate : function() {
        return $http.jsonp(url)
        .then(function success(response) {
          return response.data;
        }, function error(response) {
          //log error
        });
      }
    }
  });