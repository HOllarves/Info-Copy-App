angular.module('', [])
    .directive('sideNav', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).sideNav({
                    closeOnClick: true
                });
            }
        };
    })
    .directive('materialbox', function(){
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).materialbox();
            }
        };
    })
    .directive('modal', function(){
        return {
            restrict: 'AE',
            scope: {
                visible: '='
            },
            link: function (scope, element, attrs) {
                scope.$watch('visible', function(visible){
                    if(visible == true){
                        $(element).openModal({
                            complete: function() {
                                scope.$apply(function() {
                                    scope.visible = false;
                                });
                            }
                        });
                    }else{
                        $(element).closeModal();
                    }
                });
            }
        };
    })
    .directive('datePicker', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).pickadate({
                    selectMonths: true,
                    selectYears: 15
                });
            }
        };
    })
    .directive('textarea', function () {
        return {
            restrict: 'E',
            scope: {
                value: '='
            },
            link: function (scope, element, attrs) {
                scope.$watch('value', function(value){
                    $(element).val(value);
                    $(element).trigger('autoresize');
                });

                element.on('change', function(event){
                    var newVal = element.val();
                    scope.value = newVal;
                });
            }
        };
    });
