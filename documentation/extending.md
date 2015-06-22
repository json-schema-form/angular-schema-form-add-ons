Extending Angular Schema Form(ASF)
=====================
ASF is designed to be easily extended and there are two ways to do it:

1. Add a new field type, for example, to make add-ons like the [date picker](https://github.com/Textalk/angular-schema-form-datepicker).
2. Add a new decorator, when you need to make general behavioral changes for your application(?)

*In this text, an "ASF user" does not mean an end-user, but a developer using ASF.*

## Adding a field type

### What is a field type?

A ASF field type consists of the following parts:

1. A HTML template that define the UI 
2. An AngularJS config file that adds the extra configuration to ASF
3. Optionally: Additional controllers and directives. 

The minimal configuration for implementing a new field type is 1 and 2, and is represented by the 
[minimal example](https://github.com/OptimalBPM/angular-schema-form-add-ons/tree/master/examples/minimal).

More advanced functionality is shown in the [camelCase example](https://github.com/OptimalBPM/angular-schema-form-add-ons/tree/master/examples/camelcase)

### Creating a field type/add-on

*Before you embark on creating a new field type, please read the [creating a new add-on](https://github.com/OptimalBPM/angular-schema-form-add-ons/wiki/Creating-a-new-add-on) article.*

#### The HTML template
The HTML template defines the UI(view) of the field type, what the user sees. 
The ["minimal" example](https://github.com/OptimalBPM/angular-schema-form-add-ons/blob/master/examples/minimal/src/angular-schema-form-minimal.html) 
shows a very basic implementation.

Basically, ASF shows the template instead of the built-in UI when it encounters either a specified combination of schema types, or a "type" field type setting in the form. 

There is more on what the template can do later on, in the [Scope and helper functions](https://github.com/OptimalBPM/angular-schema-form-add-ons/blob/New_Extending/documentation/extending.md#Scope)-section.

#### Make ASF show my field type when it is supposed to

Just creating a template is not enough, ASF needs to know when to use it.
ASF provides two ways to decide when to show a field type, implicitly or explicitly.

To configure ASF for this, module.config is used.
This document will use the [configuration of the "minimal" example](https://github.com/OptimalBPM/angular-schema-form-add-ons/blob/master/examples/minimal/src/angular-schema-form-minimal.js) 
to demonstrate these and try to explain it. It is recommended to open the example in another tab for reference. 

In it, the configuration is applied to schema form as a function definition:
```javascript
angular.module('schemaForm').config(['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
    
    // Default mappings goes in here..
    
    // Explicit type mappings also..
    
    // Register it as a directive
}]);        
```

So first, how to show it as as per default:

##### Implicitly, default UI for a schema field

Let's assume that the schema specifies a combination of data type(not to be confused with the "type" in the form)  and format that 
should get "our" field type as default:
```javascript
minimal_format: {
    type: "string",
    format: "minimal",
    description: "When you edit this, it is in the add-ons input box."
},
```
We want our field type to be use in this situation. 
You achieve this by adding it to the `schemaFormProvider.defaults` object. The `schemaFormProvider.defaults`
is an object with a key for each type *in JSON Schema* with a array of functions as its value.

```javascript
var defaults = {
  string: [],
  object: [],
  number: [],
  integer: [],
  boolean: [],
  array: []
};
```

When ASF traverses the JSON Schema to create default form definitions it first checks the
*JSON Schema type* and then calls on each function in the corresponding list *in order* until a
function actually returns something. That is then used as a default.

So, to make ASF show the "minimal" field type, a callback function is registered in the defaults array:

```javascript
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
```

Now, when ASF loops the defaults-array for "string", one entry will return a form instance when the type is "string" and schema.format is "minimal".
ASF will the use that form, hopefully only the "minimal"-form to display the field type template.

The condition for the "minimal" field type default could be any condition, for example, if the schema.format condition was removed, 
all "string" type fields would get the "minimal" field type UI.

##### Explicitly specified field type

The there is the case where a ASF user explicitly specifies the field type in the form definition:
```javascript
    {
        "key": "minimal_form_type",
        "title": "Example of minimal editor via form type",
        "type": "minimal"
    }
```

To show a field type when the type is specified, the field type has to be registered. 
That mapping is then made like this:
```javascript
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'minimal',
        'directives/decorators/bootstrap/minimal/angular-schema-form-minimal.html');
```

The first argument is the name of the decorator, usually `bootstrapDecorator`. Use that unless you know what you are doing.
The second argument is the name of your new form type, in this case `minimal`
The third is the template we bind to it. 

#### Finally register the directive

To have the field type be made into a directive that ASF can invoke, it must be created and registered as such:
```javascript
    schemaFormDecoratorsProvider.createDirective('minimal',
        'directives/decorators/bootstrap/minimal/angular-schema-form-minimal.html');
```

At this stage, we might have a working add-in. However, normally, the template needs to be developed further:

### Scope and helper functions

It is up to the template to use directives, controllers and any other angular trick to implement whatever it want to implement.

Each form field will be rendered inside a decorator directive, created by the
`schemaFormDecorators` factory service, *do*
[check the source](https://github.com/Textalk/angular-schema-form/blob/master/src/services/decorators.js#L33).

This means you have several helper functions and values on scope, most important of them, `form`. The
`form` variable contains the merged form definition for that field, i.e. your supplied form object +
the defaults from the schema (it also has its part of the schema under *form.schema*).
This is how you define and use new form field options, whatever is set on the form object is
available here for you to act on.

| Name     |  What it does  |
|----------|----------------|
| form      | Form definition object |
| showTitle() | Shorthand for `form && form.notitle !== true && form.title` |
| ngModel   | The ngModel controller, this will be on scope if you use either the directive `schema-validate` or `sf-array` |
| evalInScope(expr, locals) | Eval supplied expression, ie scope.$eval |
| evalExpr(expr, locals) | Eval an expression in the parent scope of the main `sf-schema` directive. |
| interp(expr, locals) | Interpolate an expression which may or may not contain expression `{{ }}` sequences |
| buttonClick($event, form)  | Use this with ng-click to execute form.onClick |
| hasSuccess() | Shorthand for `ngModel.$valid && (!ngModel.$pristine || !ngModel.$isEmpty(ngModel.$modelValue))` |
| hasError() | Shorthand for `ngModel.$invalid && !ngModel.$pristine` |

### The magic $$value$$
ASF wants to play nice with the built in Angular directives for form. 

Especially `ng-model`, which we want to handle the two way binding against our model value. Also by using `ng-model` we
get all the nice validation states from the `ngModelController` and `FormController` that we all
know and love.

To get that working properly we had to resort to a bit of trickery, right before we let Angular
compile the field template we do a simple string replacement of `$$value$$` and replace that
with the path to the current form field on the model, i.e. `form.key`.

So `ng-model="$$value$$"` becomes something like `ng-model="model['person']['address']['street']"`,
you can see this if you inspect the final form in the browser.

*Hint: The [camelCase example demo](http://demo.optimalbpm.se/angular-schema-form-add-ons/examples/camelcase/example.html) actually prints out the value of $$value$$ in the second field.*

So basically, you always have a `ng-model="$$value$$"` (Pro tip: ng-model is fine on any element, put
  it on the same div as your custom directive and require the ngModelController for full control).

#### Deprecation warning
There is still a `errorMessage` function on scope but it's been deprecated. Please use the
`sf-message` directive instead.

### schema-validate directive
`schema-validate` is a directive that you should put on the same element as your `ng-model`. It is
responsible for validating the value against the schema using [tv4js](https://github.com/geraintluff/tv4)
It takes the form definition as an argument.


### sf-message directive
Error messages are nice, and the best way to get them is via the `sf-message` directive. It usually
takes `form.description` as an argument so it can show that until an error occurs.


### Sharing your add-on with the world

If you now have a working add-on, it is time to share it with the rest of us.

The [publishing the add-on](https://github.com/OptimalBPM/angular-schema-form-add-ons/wiki/Publishing-the-add-on) article details how this is done.


Decorators
----------
Decorators are a second way to extend Schema Form, the thought being that you should easily be able
to change *every* field. Maybe you like it old school and want to use bootstrap 2. Or maybe you like
to generate a table with the data instead? Right now there are no other decorators than bootstrap 3.

Basically a *decorator* sets up all the mappings between form types and their respective templates
using the `schemaFormDecoratorsProvider.createDecorator()` function.

```javascript
var base = 'directives/decorators/bootstrap/';

schemaFormDecoratorsProvider.createDecorator('bootstrapDecorator', {
  textarea: base + 'textarea.html',
  fieldset: base + 'fieldset.html',
  array: base + 'array.html',
  tabarray: base + 'tabarray.html',
  tabs: base + 'tabs.html',
  section: base + 'section.html',
  conditional: base + 'section.html',
  actions: base + 'actions.html',
  select: base + 'select.html',
  checkbox: base + 'checkbox.html',
  checkboxes: base + 'checkboxes.html',
  number: base + 'default.html',
  password: base + 'default.html',
  submit: base + 'submit.html',
  button: base + 'submit.html',
  radios: base + 'radios.html',
  'radios-inline': base + 'radios-inline.html',
  radiobuttons: base + 'radio-buttons.html',
  help: base + 'help.html',
  'default': base + 'default.html'
}, [
  function(form) {
    if (form.readonly && form.key && form.type !== 'fieldset') {
      return base + 'readonly.html';
    }
  }
]);
```
`schemaFormDecoratorsProvider.createDecorator(name, mapping, rules)` takes a name argument, a mapping object
(type -> template) and an optional list of rule functions.

When the decorator is trying to match a form type against a tempate it first executes all the rules
in order. If one returns that is used as template, otherwise it checks the mappings.
