angular.module('app').service('CustomModalService', ['$uibModal', function ($uibModal) {

	this.openCustomModal = function (size, title, message, action) {
		var actionToPerformOnConfirm = action;

		var modalInstance = $uibModal.open({
			templateUrl: 'templates/CustomModal.html',
			controller: 'CustomModalInstanceController',
			controllerAs: 'vm',
			size: size,
			resolve: {
				content: function () {
					return "jesus";
				}
			}
		});

		modalInstance.result.then(function (actionToPerformOnConfirm) {
			console.log('something happened');
		}.bind(this));
	};
}]);

	
