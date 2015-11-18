angular
  .module('age-calculator')
  .filter('time', function() {
    return function(input) {
      return input < 10 ? "0" + input : input;
    }
  });