"use strict";

angular.module("infoCopy.routes")
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                title: "Login Page",
                views: {
                    "root-view": {
                        templateUrl: "modules/login/login.html",
                        controller: "LoginCtrl"
                    }
                }
            })
            .state("root", {
                url: "",
                abstract: true,
                views: {
                    "root-view": {
                        templateUrl: "modules/layout/layout.html",
                        controller: "LayoutCtrl"
                    }
                }
            })
            .state("root.home", {
                url: "/home",
                title: "Home",
                views: {
                    "content": {
                        templateUrl: "modules/home/home.html",
                        controller: "HomeCtrl",
                        controllerAs: "home"
                    }
                }
            })
        $urlRouterProvider.otherwise("/")
    })
    .run(function ($rootScope) {
        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            if (toState.title) {
                $rootScope.title = toState.title;
            }
        })
    })