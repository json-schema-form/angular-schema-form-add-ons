Extending Angular Schema Form(ASF)
=====================
ASF is designed to be easily extended and there are two basic ways to do it:

1. Add a new field type, for example, to make add-ons like the [date picker](https://github.com/Textalk/angular-schema-form-datepicker).
2. Add a new decorator, when you need to make general behavioral changes for your application(?)

An "ASF user" does not mean an end-user, but a developer using of ASF.

## Adding a field type

### What makes a field type

A field type is made up of the following parts:
1. A HTML template that provides what i should contain
2. An angular config file that adds the extra configuration to the Schema form
3. Optionally: Additional controllers and directives. 

The minimal configuration for implementing a new field type is 1 and 2, and is represented by the 
[minimal example](https://github.com/OptimalBPM/angular-schema-form-add-ons/tree/master/examples/minimal).

More advanced functionality is shown in the [camelCase example](https://github.com/OptimalBPM/angular-schema-form-add-ons/tree/master/examples/camelcase)

### Creating a field type/add-on

*Before you embark on creating a new field type, please read the [creating a new add-on](https://github.com/OptimalBPM/angular-schema-form-add-ons/wiki/Creating-a-new-add-on) article.*

#### The HTML template
The HTML template defines the UI of the field type. [Minimal example](https://github.com/OptimalBPM/angular-schema-form-add-ons/blob/master/examples/minimal/src/angular-schema-form-minimal.html)

Basically, ASF shows that instead of the built-in UIs when it encounters either a specified combination of schema types, or a "type" setting in the form. 

#### Make ASF show my field type when it is supposed to
Just creating a template is not enough to make ASF aware, neither of the field types existance, or when to use it.
ASF provides two ways to decide when to show a field type, implicitly or explicitly.

To configure ASF document for this, module.config is used.
This document will use the [configuration of the "minimal" example](https://github.com/OptimalBPM/angular-schema-form-add-ons/blob/master/examples/minimal/src/angular-schema-form-minimal.js) 
to demonstrate these. 

In it, the configuration is applied to schema form as a function definition:
    
    angular.module('schemaForm').config(['schemaFormProvider',
        'schemaFormDecoratorsProvider', 'sfPathProvider',
        function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
        
        -- Default mappings goes in here..
        
        -- Explicit type mappings also..
        
    }]);        



##### Implicitly, default UI for a schema field

##### Explicitly specified field type
Example 1, an ASF user specifies the field type in the form definition:
    
    {
        "key": "minimal_form_type",
        "title": "Example of minimal editor via form type",
        "type": "minimal"
    }

If a field has a specified type, as in the Example 1, a mapping is used. 
That mapping 






Ex. from the [datepicker add-on](https://github.com/Textalk/angular-schema-form-datepicker/blob/master/src/bootstrap-datepicker.js#L18)
```javascript
 schemaFormDecoratorsProvider.addMapping(
  'bootstrapDecorator',
  'datepicker',
  'directives/decorators/bootstrap/datepicker/datepicker.html'
);
```

The second argument is the name of your new form type, in this case `datepicker`, and the third is
the template we bind to it (the first is the decorator, use `bootstrapDecorator` unless you know
what you are doing).

What this means is that a form definition like this:
```javascript
$scope.form = [
  {
    key: "birthday",
    type: "datepicker"
  }
];
```
...will result in the `datepicker.html` template to be used to render that field in the form.

But wait, where is all the code? Basically it's then up to the template to use directives to
implement whatever it likes to do. It does have some help though, lets look at template example and
go through the basics.

This is sort of the template for the datepicker:
```html
<div class="form-group" ng-class="{'has-error': hasError()}">
  <label class="control-label" ng-show="showTitle()">{{form.title}}</label>

  <input ng-show="form.key"
         style="background-color: white"
         type="text"
         class="form-control"
         schema-validate="form"
         ng-model="$$value$$"
         pick-a-date
         min-date="form.minDate"
         max-date="form.maxDate"
         format="form.format" />

  <span class="help-block" sf-message="form.description"></span>
</div>
```

### What's on the scope?
Each form field will be rendered inside a decorator directive, created by the
`schemaFormDecorators` factory service, *do*
[check the source](https://github.com/Textalk/angular-schema-form/blob/master/src/services/decorators.js#L33).

This means you have several helper functions and values on scope, most important of this `form`. The
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

#### Deprecation warning
There is still a `errorMessage` function on scope but it's been deprecated. Please use the
`sf-message` directive instead.


### The magic $$value$$
Schema Form wants to play nice with the built in Angular directives for form. Especially `ng-model`
which we want to handle the two way binding against our model value. Also by using `ng-model` we
get all the nice validation states from the `ngModelController` and `FormController` that we all
know and love.

To get that working properly we had to resort to a bit of trickery, right before we let Angular
compile the field template we do a simple string replacement of `$$value$$` and replace that
with the path to the current form field on the model, i.e. `form.key`.

So `ng-model="$$value$$"` becomes something like `ng-model="model['person']['address']['street']"`,
you can see this if you inspect the final form in the browser.

So basically always have a `ng-model="$$value$$"` (Pro tip: ng-model is fine on any element, put
  it on the same div as your custom directive and require the ngModelController for full control).

### schema-validate directive
`schema-validate` is a directive that you should put on the same element as your `ng-model`. It is
responsible for validating the value against the schema using [tv4js](https://github.com/geraintluff/tv4)
It takes the form definition as an argument.


### sf-message directive
Error messages are nice, and the best way to get them is via the `sf-message` directive. It usually
takes `form.description` as an argument so it can show that until an error occurs.


### Setting up schema defaults
So you got this shiny new add-on that adds a fancy field type, but feel a bit bummed out that you
need to specify it in the form definition all the time? Fear not because you can also add a "rule"
to map certain types and conditions in the schema to default to your type.

You do this by adding to the `schemaFormProvider.defaults` object. The `schemaFormProvider.defaults`
is an object with a key for each type *in JSON Schema* with a array of functions as its value.

```javscript
var defaults = {
  string: [],
  object: [],
  number: [],
  integer: [],
  boolean: [],
  array: []
};
```

When schema form traverses the JSON Schema to create default form definitions it first checks the
*JSON Schema type* and then calls on each function in the corresponding list *in order* until a
function actually returns something. That is then used as a defualt.

This is the function that makes it a datepicker if its a string and has format "date" or "date-time":

```javascript
var datepicker = function(name, schema, options) {
  if (schema.type === 'string' && (schema.format === 'date' || schema.format === 'date-time')) {
    var f = schemaFormProvider.stdFormObj(name, schema, options);
    f.key = options.path;
    f.type = 'datepicker';
    options.lookup[sfPathProvider.stringify(options.path)] = f;
    return f;
  }
};

// Put it first in the list of functions
schemaFormProvider.defaults.string.unshift(datepicker);
```

### Sharing your add-on with the world
So you made an add-on, why not share it with us? On the front page,
[http://textalk.github.io/angular-schema-form/](http://textalk.github.io/angular-schema-form/#third-party-addons), we
maintain a list of add ons based on a query of the bower register, and we love to see your add-on
there.

Any [bower](http://bower.io) package with a name starting with `angular-schema-form-` or that has
the `keyword` `angular-schema-form-add-on` in its `bower.json` will be picked up. It's cached so
there can be a delay of a day or so.

So [make a bower package](http://bower.io/docs/creating-packages/), add the keyword
`angular-schema-form-add-on` and [register it](http://bower.io/docs/creating-packages/#register)!

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
