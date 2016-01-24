/**
 * Angular smart table global search outside table
 * @see https://github.com/lorenzofox3/Smart-Table/issues/568
 */

angular
    .module('app').directive('stSearchOutside', function()
{
    return {
       require:'^stTable',
       scope: {
          stSearchOutside:'='
       },

       link: function(scope, element, attr, ctrl)
       {
           scope.$watch('stSearchOutside', function(val)
           {
            return ctrl.search(val);
           });
       }
    }
});
