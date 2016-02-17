angular.module('app')
	.controller('CustomModalInstanceController', ['$scope', '$uibModalInstance', 'content', function ($scope, $uibModalInstance, content) {

		$scope.title		= content.title;
		$scope.message		= content.message;
		$scope.note			= content.note;
		$scope.confirmText	= content.confirmText;
		$scope.cancelText	= content.cancelText;
		$scope.uiSref		= content.uiSref;

		$scope.confirmAction = function () {
			$uibModalInstance.close();
		};

		$scope.cancelAction = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}
]);