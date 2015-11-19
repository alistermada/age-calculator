angular
	.module('age-calculator', [])
	.controller('CalculatorController', ['$scope', '$interval', 'wikipedia', function($scope, $interval, wikipedia) {
		$scope.getDaysInMonth = function(month, year) {
			var monthIndex = $scope.months.indexOf(month);
			var daysInMonth = $scope.daysEachMonth[monthIndex];
			var days = $scope.getListOfNumbers(1, daysInMonth);
			var leapYear = false;

			if (month === "Feb" && $scope.isLeapYear(year)) {
				days.push(29);
			}

			return days;
		};

		$scope.isLeapYear = function(year) {
			if (year % 4 === 0) {
				return true;
			} else {
				return false;
			}
		}

		$scope.adjustNullDay = function(dayType, day, lastDay) {
			if (day > lastDay) {
				$scope[dayType] = lastDay;
			}
		}

		$scope.getListOfNumbers = function(min, max) {
			var list = [];
			for (var i = min; i <= max; i++) {
				list.push(i);
			}
			return list;
		};

    $scope.calculate = function() {
    	var milliPerYear = 31536000000;
      var milliPerDay = milliPerYear / 365;
			var startMonthIndex = $scope.months.indexOf($scope.startMonth);
      var endMonthIndex = $scope.months.indexOf($scope.endMonth);
      var startTime = new Date(0, startMonthIndex, $scope.startDay, $scope.startHour, $scope.startMinute);
      startTime.setFullYear($scope.startYear);
      var endTime = new Date(0, endMonthIndex, $scope.endDay, $scope.endHour, $scope.endMinute);
      endTime.setFullYear($scope.endYear);

    	//Age in milliseconds
      var age = endTime - startTime;
      
      $scope.ageTotalDays = Math.floor(age / milliPerDay);
      $scope.ageTotalHours = Math.floor(age / milliPerDay * 24);
      $scope.ageYear = $scope.endYear - $scope.startYear;
      $scope.ageMonth = endMonthIndex - startMonthIndex;
      if ($scope.ageMonth < 0) {
        $scope.ageYear --;
        $scope.ageMonth += 12;
      }
      $scope.ageDay = $scope.endDay - $scope.startDay;
      if ($scope.ageDay < 0) {
        $scope.ageMonth --;
        $scope.ageDay += $scope.daysEachMonth[startMonthIndex];
      }
      $scope.ageHour = $scope.endHour - $scope.startHour;
      if ($scope.ageHour < 0) {
        $scope.ageDay --;
        $scope.ageHour += 24;
      }
      $scope.ageMinute = $scope.endMinute - $scope.startMinute;
      if ($scope.ageMinute < 0) {
        $scope.ageHour --;
        $scope.ageMinute += 60;
      }
    }

    $scope.queryWikipedia = function(){
    	wikipedia.getBirthDate().then(function(data) {
    		var birthDate, pageContent;
    		var pageResult = data.query.pages;
    		for (var page in pageResult) {
    			if (pageResult.hasOwnProperty(page)) {
        		pageContent = pageResult[page].revisions[0]['*'];
    			}
				}
				var birthDateString = pageContent.match('birth_date  = {{(.*)}}');

				if (birthDateString) {
					//[year, month, date]
					birthDate = birthDateString[1].match(/\d+/g);
					$scope.startYear = parseInt(birthDate[0]);
					$scope.startMonth = $scope.months[parseInt(birthDate[1]) - 1];
					$scope.startDay = parseInt(birthDate[2]);
					$scope.startHour = 0;
					$scope.startMinute = 0;
				} else {
					console.log("Date of birth not found");
				}
   		});
    }

		$scope.$watchGroup(['startMonth', 'startYear'], function() {
			$scope.startDays = $scope.getDaysInMonth($scope.startMonth, $scope.startYear);
			$scope.adjustNullDay('startDay', $scope.startDay, $scope.startDays.length);
		});

		$scope.$watchGroup(['endMonth', 'endYear'], function() {
			$scope.endDays = $scope.getDaysInMonth($scope.endMonth, $scope.endYear);
			$scope.adjustNullDay('endDay', $scope.endDay, $scope.endDays.length);
		});

		(function init() {
			var now = new Date;
			$scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			$scope.daysEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			$scope.hours = $scope.getListOfNumbers(0, 23);
			$scope.minutes = $scope.getListOfNumbers(0, 59);
			$scope.startHour = now.getHours();
			$scope.startMinute  = now.getMinutes();
			$scope.endHour = now.getHours();
			$scope.endMinute = now.getMinutes();

			$scope.startMonth = $scope.months[now.getMonth()];
			$scope.endMonth = $scope.months[now.getMonth()];
			$scope.startYear = now.getFullYear();
			$scope.endYear = now.getFullYear();

			$scope.startDays = $scope.getDaysInMonth($scope.startMonth, $scope.startYear);
			$scope.endDays = $scope.getDaysInMonth($scope.endMonth, $scope.endYear);

			$scope.startDay = now.getDate();
			$scope.endDay = now.getDate();

			$scope.startTime = now;
			$scope.endTime = now;

			$scope.calculateInterval = $interval($scope.calculate, 250);

			
		})();
	}]);