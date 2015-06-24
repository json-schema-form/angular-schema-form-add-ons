/**
 * Created by Nicklas B on 2015-06-21.
 */

/*global angular */
"use strict";

/**
 * The main app module
 * @name exampleApp
 * @type {angular.Module}
 */

var exampleApp = angular.module("exampleApp", ["schemaForm"]);

exampleApp.controller("exampleController", ["$scope", function ($scope) {


    // This is the schema definition, note that the title, even though it is possible to, isn't defined here.
    // This to make the schema more portable, schemas are for validation and definition and can be used everywhere.
    $scope.schema = {
        type: "object",
        title: "Minimal",
        properties: {
            minimalFormat: {
                type: "string",
                format: "minimal",
                description: "When you edit this, it is in the add-ons input box."
            },
            minimalFormType: {
                type: "string",
                description: "When you edit this, which is required, it is equally in the add-ons input box"
            }
        },
        required: ["minimalFormType"]
    };

    // Define all UI aspects of the form
    $scope.form = [

        {
            "key": "minimalFormat",
            "title": "Example of minimal editor via format"
        },
        {
            "key": "minimalFormType",
            "title": "Example of minimal editor via form type",
            "type": "minimal",
            "some_setting": "true"
        },
        {
            type: "submit",
            style: "btn-info",
            title: "OK"
        }
    ];
    // Initiate the model
    $scope.model = {};
    // Initiate one of the inputs
    $scope.model.minimalFormat = "default value";

    // This is called by asf on submit, specified in example.html, ng-submit.
    $scope.submitted = function (form) {
        $scope.$broadcast("schemaFormValidate");
        console.log($scope.model);
    };
}]);

