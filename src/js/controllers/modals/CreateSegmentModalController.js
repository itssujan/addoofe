angular.module('app')
	.controller('CreateSegmentModalController', ['$scope', '$uibModalInstance', '$timeout', 'content', 
		function ($scope, $uibModalInstance, $timeout, content) {
			$scope.segment = {};
			$scope.segment.rules = [];

			var Operator = function(id,name) {
				this.id = id;
				this.name = name;
			}


			var initializeRule = function() {
				var rule = {};
				rule.sourceFields = ['Field1', 'Field2', 'Field3'];
				rule.operators = getOperators();
				rule.sourceField = "";
				$scope.segment.rules = [];
				var ruleSets = [];
				ruleSets.push(rule);
				$scope.segment.rules.push({'ruleSets' : ruleSets});
				console.log(JSON.stringify($scope.segment));

			}

			var getOperators = function() {
				var operators = [];
				var equals = new Operator("=","euqals");
				var notequals = new Operator("!=","not euqals");
				var greaterThan = new Operator(">","greater than");
				var lessThan = new Operator("<","less than");
				operators.push(equals);
				operators.push(notequals);
				operators.push(greaterThan);
				operators.push(lessThan);
				return operators;
			}

			$scope.addAndRule = function() {
				
			}

			$scope.addOrRule = function() {
				console.log("Adding or rule");
				var rule = {};
				rule.sourceFields = ['Field1', 'Field2', 'Field3'];
				rule.operators = getOperators();
				rule.sourceField = "";
				var ruleSets = [];
				ruleSets.push(rule);
				$scope.segment.rules.push({'ruleSets' : ruleSets});
				console.log(JSON.stringify($scope.segment));
			}

			initializeRule();
	}]);