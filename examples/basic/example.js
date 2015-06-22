/**
 * Created by Nicklas B on 2015-06-21.
 */

/*global angular */
"use strict";

/**
 * The main app module
 * @name basicApp
 * @type {angular.Module}
 */

var basicApp = angular.module("basicApp", ["schemaForm"]);

basicApp.controller("appController", ["$scope", function ($scope) {


    $scope.schema = {
        type: "object",
        title: "Select",
        properties: {
            basic_format: {
                title: "Example of basic editor via format",
                type: "string",
                format: "basic",
                description: "When you edit this, the value will become automatically camelCased"
            },
            basic_form_type: {
                title: "Example of basic editor via form type",
                type: "string",
                description: "When you edit this, the value will become equally camelCased"
            }
        },
        required: ["basic"]
    };

    $scope.form = [

        {
            "key": "basic_format"
        },
        {
            "key": "basic_form_type",
            "type": "basic",
            "some_setting": "true"
        },
        {
            type: "submit",
            style: "btn-info",
            title: "OK"
        }

    ];
    $scope.model = {};
    $scope.model.basic_format = "default value";

    $scope.submitted = function (form) {
        $scope.$broadcast("schemaFormValidate");
        console.log($scope.model);
    };
}])
;

