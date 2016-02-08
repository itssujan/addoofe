// /**
//  * Loading Directive
//  * @see http://tobiasahlin.com/spinkit/
//  */

// angular
//     .module('app')
//     .directive('rdLoading', rdLoading);

// function rdLoading() {
//     var directive = {
//         restrict: 'AE',
//         template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
//     };
//     return directive;
// };
angular.module('app')
  .directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="..."/>LOADING...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  })
