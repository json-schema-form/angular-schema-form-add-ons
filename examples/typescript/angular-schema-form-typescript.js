angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/typescript/angular-schema-form-typescript.html","<div ng-class=\"{\'has-error\': hasError()}\"><label ng-show=\"showTitle()\">{{form.title}}</label><div ng-model=\"$$value$$\" type-script-directive=\"\"><input ng-model=\"$$value$$\"><button type=\"button\" ng-click=\"controller.makeCamelCase()\">camelCase it</button></div><span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span><br><span ng-show=\"form.some_setting\">The some setting-setting is true for the model at $$value$$!</span></div>");}]);
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
angular.module('schemaForm').config(['schemaFormProvider',
    'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
        // First, we want this to be the default for a combination of schema parameters
        var typescript = function (name, schema, options) {
            if (schema.type === 'string' && schema.format == 'typescript') {
                // Initiate a form provider
                var f = schemaFormProvider.stdFormObj(name, schema, options);
                f.key = options.path;
                f.type = 'typescript';
                // Add it to the lookup dict (for internal use)
                options.lookup[sfPathProvider.stringify(options.path)] = f;
                return f;
            }
        };
        // Add our default to the defaults array
        schemaFormProvider.defaults.string.unshift(typescript);
        // Second, we want it to show if someone have explicitly set the form type
        schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'typescript', 'directives/decorators/bootstrap/typescript/angular-schema-form-typescript.html');
    }]);
// Declare a controller, this is used in the typescriptDirective below
var typescriptController = (function () {
    function typescriptController($scope, element) {
        var _this = this;
        this.$scope = $scope;
        this.camelCase = function (input) {
            // Turn the input value into typescript and return it.
            return input.toLowerCase().replace(/[- ](.)/g, function (match, group1) {
                return group1.toUpperCase();
            });
        };
        this.makeCamelCase = function () {
            // This is invoked by the ng-click
            // The ngModel in ASF is an array, we want to access the actual value
            var leaf_model = _this.directiveScope.ngModel[_this.directiveScope.ngModel.length - 1];
            if (leaf_model.$modelValue) {
                // If there is something to camel case, do it!
                leaf_model.$setViewValue(_this.camelCase(leaf_model.$modelValue));
            }
            ;
        };
        console.log("Initiating the process controller" + $scope.toString());
        $scope.controller = this;
        this.directiveScope = $scope;
    }
    return typescriptController;
})();
;
// Create a directive to properly access the ngModel set in the view (src/angular-schema-form-typescript.html)
angular.module('schemaForm').directive('typeScriptDirective', function () {
    return {
        // The directive needs the ng-model to be set, look at the <div>
        require: ['ngModel'],
        restrict: 'A',
        // Do not create a isolate scope, makeCamelCase should be available to the button element
        scope: false,
        // Define a controller, use the function from above, inject the scope
        controller: ['$scope', typescriptController],
        link: function (scope, iElement, iAttrs, ngModelCtrl) {
            scope.ngModel = ngModelCtrl;
        }
    };
});
