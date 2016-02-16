angular.module('app').controller('CustomModalInstanceController', ['$scope', '$uibModalInstance', 'content', function ($scope, $uibModalInstance, content) {

	var vm = this;

	$scope.title = content.title;
	$scope.message = content.message;
	$scope.confirmText = content.confirmText;
	$scope.cancelText = content.cancelText;

	$scope.confirmAction = function () {
		$uibModalInstance.close();
	};

	$scope.cancelAction = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]);