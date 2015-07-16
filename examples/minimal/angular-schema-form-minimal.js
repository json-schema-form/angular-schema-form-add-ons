angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/minimal/angular-schema-form-minimal.html","<!--\nThis is the implementation of the view.\n\nAll references to css classes here are for bootstrap classes, for them to work, Bootstrap has to be installed.\n\nIMPORTANT: The ASF magic $$value$$ will be changed by ASF into model[\'minimal_format\'] or model[\'minimal_form_type\']\nduring compilation. This is the recommended way to access the model until there is a better solution.\n-->\n\n<!-- hasError is implemented by ASF and returns true if there is a validation error. -->\n<div ng-class=\"{\'has-error\': hasError()}\">\n    <!-- The showTitle function is implemented by ASF, returns true if the title should be shown -->\n    <label ng-show=\"showTitle()\">{{form.title}}</label>\n\n    <!-- This is the input-->\n    <div>\n        <!-- Bind the input to the model-->\n        <input ng-model=\"$$value$$\"><span> <-- This is the minimal editor</span>\n    </div>\n    <!-- hasError() and the other functions are also defined by ASF, so this will either\n        show a validation error or the description -->\n    <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");}]);
angular.module('schemaForm').config(['schemaFormProvider',
    'schemaFormDecoratorsProvider', 'sfPathProvider',
    function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

        // First, we want this to be the default for a combination of schema parameters
        var minimal = function (name, schema, options) {
            if (schema.type === 'string' && schema.format == 'minimal') {
                // Initiate a form provider
                var f = schemaFormProvider.stdFormObj(name, schema, options);
                f.key = options.path;
                f.type = 'minimal';
                // Add it to the lookup dict (for internal use)
                options.lookup[sfPathProvider.stringify(options.path)] = f;
                return f;
            }
        };
        // Add our default to the defaults array
        schemaFormProvider.defaults.string.unshift(minimal);
 
        // Second, we want it to show if someone have explicitly set the form type
        schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'minimal',
            'directives/decorators/bootstrap/minimal/angular-schema-form-minimal.html');
    }]);


