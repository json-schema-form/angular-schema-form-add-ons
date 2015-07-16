angular.module('schemaForm').config(['schemaFormProvider',
    'schemaFormDecoratorsProvider', 'sfPathProvider',
    function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

        // First, we want this to be the default for a combination of schema parameters
        var camelcase = function (name, schema, options) {
            if (schema.type === 'string' && schema.format == 'camelcase') {
                // Initiate a form provider
                var f = schemaFormProvider.stdFormObj(name, schema, options);
                f.key = options.path;
                f.type = 'camelcase';
                // Add it to the lookup dict (for internal use)
                options.lookup[sfPathProvider.stringify(options.path)] = f;
                return f;
            }
        };
        // Add our default to the defaults array
        schemaFormProvider.defaults.string.unshift(camelcase);

        // Second, we want it to show if someone have explicitly set the form type
        schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'camelcase',
            'directives/decorators/bootstrap/camelcase/angular-schema-form-camelcase.html');
    }]);


// Declare a controller, this is used in the camelcaseDirective below
var camelCaseControllerFunction =  function($scope) {

    $scope.camelCase = function (input) {
        // Turn the input value into camelCase and return it.
        return input.toLowerCase().replace(/[- ](.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    };

    $scope.makeCamelCase = function () {
        // This is invoked by the ng-click
        // The ngModel in ASF is an array, we want to access the actual value
        var leaf_model = $scope.ngModel[$scope.ngModel.length - 1];
        if (leaf_model.$modelValue) {
            // If there is something to camelCase, do it!
            leaf_model.$setViewValue($scope.camelCase(leaf_model.$modelValue));
        };
    };
};

// Create a directive to properly access the ngModel set in the view (src/angular-schema-form-camelcase.html)
angular.module('schemaForm').directive('camelCaseDirective', function() {
  return {
    // The directive needs the ng-model to be set, look at the <div>
    require: ['ngModel'],
    restrict: 'A',
    // Do not create a isolate scope, makeCamelCase should be available to the button element
    scope: false,
    // Define a controller, use the function from above, inject the scope
    controller : ['$scope', camelCaseControllerFunction],
    // Use the link function to initiate the ngModel in the controller scope
    link: function(scope, iElement, iAttrs, ngModelCtrl) {
        scope.ngModel = ngModelCtrl;
    }
  };
});
