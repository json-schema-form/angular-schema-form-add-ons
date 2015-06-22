
camelCase add-on
=================
### About

This example presents a normal input field and a button that changes whatever string has been entered into camelCase.

There is a demo, basically just the  running at http://demo.optimalbpm.se/angular-schema-form-add-ons/examples/camelcase/example.html

It uses:
* a directive to access the model and expose the controller to the child elements
* a controller to handle the logic of the camel-casing

These might not be needed if you do not need any local logic, but are here for the example.

Look at the source for more information on how it works, it is overly documented.


### Installation
To use the example, enter the examples/camelcase folder and run
    
    npm install bower
    node_modules/bower/bin/bower install
    
This will first locally install bower, and then used that bower to install the project dependencies. 


### Running

You should now be able to open the example.html in the browser.


### Building

First, install all build tools, in the examples/camelcase folder, run

    npm install


The cycle for development is change and then build. 
If you want to make any changes, you should make them in the /src-files and then build, otherwise your changes
will not be included in the example. 

From the installation, gulp should be installed, so therefore, in the examples/camelcase folder, just run: 
   
    gulp default
   
This starts a build and generates examples/basic/angular-schema-form-camelcase.js and examples/basic/angular-schema-form-camelcase.min.js.
To observe your changes, just refresh the example.html-page.