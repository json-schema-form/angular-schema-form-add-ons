
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
        schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'typescript',
            'directives/decorators/bootstrap/typescript/angular-schema-form-typescript.html');
    }]);


interface DirectiveScope extends ng.IScope {
    ngModel : any[];
    controller : typescriptController;
}

// Declare a controller, this is used in the typescriptDirective below
class typescriptController {

    directiveScope : DirectiveScope;

    camelCase = (input:string):string => {
        // Turn the input value into typescript and return it.
        return input.toLowerCase().replace(/[- ](.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    };

    makeCamelCase = () => {
        // This is invoked by the ng-click
        // The ngModel in ASF is an array, we want to access the actual value
        var leaf_model = this.directiveScope.ngModel[this.directiveScope.ngModel.length - 1];
        if (leaf_model.$modelValue) {
            // If there is something to camel case, do it!
            leaf_model.$setViewValue(this.camelCase(leaf_model.$modelValue));
        };
    };

    constructor(private $scope:DirectiveScope, element:JQuery) {
        console.log("Initiating the process controller" + $scope.toString());
        $scope.controller = this
        this.directiveScope = $scope;
    }
};

// Create a directive to properly access the ngModel set in the view (src/angular-schema-form-typescript.html)
angular.module('schemaForm').directive('typeScriptDirective', ():ng.IDirective => {
    return {
        // The directive needs the ng-model to be set, look at the <div>
        require: ['ngModel'],
        restrict: 'A',
        // Do not create a isolate scope, makeCamelCase should be available to the button element
        scope: false,
        // Define a controller, use the function from above, inject the scope
        controller : ['$scope', typescriptController],
        link: function(scope: DirectiveScope, iElement, iAttrs, ngModelCtrl) {
            scope.ngModel = ngModelCtrl;
        }
    }

});


