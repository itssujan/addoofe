angular.module('app').controller('CustomModalInstanceController', [function ($uibModalInstance, content) {

	var vm = this;

	console.log("run");

	//vm.title = content.title;
	//vm.message = content.message;
	console.log(JSON.stringify(content));

	//$scope.cancelAction = function () {
	//	$uibModalInstance.dismiss('cancel');
	//};
}]);