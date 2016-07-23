angular
    .module('app')
    .directive('multiplicationTable', multiplicationTable);

function multiplicationTable() {
    var directive = {
        //requires: '^rdWidget',
        //transclude: true,
        template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
      controllerAs : 'ctrl',
      controller : function() {
        this.rows = [
          [ 1, 1, 1, 1 ],
          [ 1, 1, 1, 1 ],
          [ 1, 1, 1, 1 ],
          [ 1, 1, 1, 1 ]
        ];
      }
    };
    return directive;
};