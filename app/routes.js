angular.module('App.routes', [])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                title: "Login Page",
                views:{
                    'root-view': {
                        templateUrl: 'modules/login/login.html',
                        controller: "LoginCtrl"
                    }
                }
            })
            .state('root', {
                url: '',
                abstract: true,
                views:{
                    'root-view': {
                        templateUrl: 'modules/layout/layout.html',
                        controller: "LayoutCtrl"
                    }
                }
            })
            .state('root.module', {
                url: '/module',
                title: "title",
                views:{
                    'content': {
                        templateUrl: 'modules/module/file.html',
                        controller: "ModuleCtrl",
                        controllerAs:'module'
                    }
                }
            });
        $urlRouterProvider.otherwise('/events');
    })
    .run(function($rootScope){
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if(toState.title){
                $rootScope.title = toState.title;
            }
        });
    });
