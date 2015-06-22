angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/camelcase/angular-schema-form-camelcase.html","<!--\nThis is the implementation of the view. When the button is clicked, the value in the model is camelCase:d.\n\nIt uses a directive to get to the ngModel properly.\nIf you have no need to modify ngModel directly, you can also just use a controller, no need for a directive.\nIf you have no need to for any local, behind-the-scenes logic, you might not need a controller at all.\n\nAll references to css classes here are for bootstrap classes, for them to work, Bootstrap has to be installed.\n\nIMPORTANT: The ASF magic $$value$$ will be changed by ASF into model[\'camelcase_format\'] or model[\'camelcase_form_type\']\nduring compilation. This is the recommended way to access the model until there is a better solution.\n-->\n\n<!-- hasError is implemented by ASF and returns true if there is a validation error. -->\n<div ng-class=\"{\'has-error\': hasError()}\">\n    <!-- The showTitle function is implemented by ASF, returns true if the title should be shown -->\n    <label ng-show=\"showTitle()\">{{form.title}}</label>\n\n    <!-- Specify the model for the directive and add the directive, making the controller available to the children-->\n    <div ng-model=\"$$value$$\" camel-case-directive>\n        <!-- Bind the input to the model-->\n        <input ng-model=\"$$value$$\">\n        <!-- Add a button that applies camelCase on the model by calling the controllers\' function -->\n        <button type=\"button\" ng-click=\"makeCamelCase()\">camelCase it</button>\n    </div>\n    <!-- hasError() and the other functions are also defined by ASF, so this will either\n        show a validation error or the description -->\n    <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n    <br />\n    <!-- The some_setting-setting we set in example.js is available here -->\n    <span ng-show=\"form.some_setting\">The some setting-setting is true for the model at $$value$$!</span>\n</div>\n");}]);
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
        schemaFormDecoratorsProvider.createDirective('camelcase',
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
