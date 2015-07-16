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


