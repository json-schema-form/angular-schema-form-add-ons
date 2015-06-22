angular.module('schemaForm').config(['schemaFormProvider',
    'schemaFormDecoratorsProvider', 'sfPathProvider',
    function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

        // First, we want this to be the default for a combination of schema parameters
        var basic = function (name, schema, options) {
            if (schema.type === 'string' && schema.format == 'basic') {
                // Initiate a form provider
                var f = schemaFormProvider.stdFormObj(name, schema, options);
                f.key = options.path;
                f.type = 'basic';
                // Add it to the lookup dict (for internal use)
                options.lookup[sfPathProvider.stringify(options.path)] = f;
                return f;
            }
        };
        // Add our default to the defaults array
        schemaFormProvider.defaults.string.unshift(basic);

        // Second, we want it to show if someone have explicitly set the form type
        schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'basic',
            'directives/decorators/bootstrap/basic/angular-schema-form-basic.html');
        schemaFormDecoratorsProvider.createDirective('basic',
            'directives/decorators/bootstrap/basic/angular-schema-form-basic.html');
    }]);


// Declare a module. In the view, this is specified using ng-controller
var basicControllerFunction =  function($scope) {

    $scope.camelCase = function (input) {
        // Make the input value into camelCase and return it.
        return input.toLowerCase().replace(/[- ](.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    };

    $scope.makeCamelCase = function () {
        // This is invoked by the ng-click

        // The model and form variables are inherited from the parent scope, $scope.$parent.
        // The key is an array, so this way of addressing the form is not optimal.
        value = $scope.formCtrl.$viewValue;
        if (value) {
            $scope.formCtrl.$setViewValue($scope.camelCase(value));
        };
    };
};

angular.module('schemaForm').directive('basic', function() {
  return {
    require: ['ngModel'],
    restrict: 'A',
    controller : basicControllerFunction
  };
});
