angular.module('app').service('CustomModalService', ['$uibModal', function ($uibModal) {

	this.openCustomModal = function (size, options, action) {

		var modalInstance = $uibModal.open({
			templateUrl: 'templates/modals/CustomModal.html',
			controller: 'CustomModalInstanceController',
			controllerAs: 'vm',
			size: size,
			resolve: {
				content: function () {
					return options;
				}
			}
		});

		modalInstance.result.then(function () {
			if (action) action();
		}.bind(this));
	};
}]);

	
