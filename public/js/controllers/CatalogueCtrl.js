catalogue = angular.module('CatalogueCtrl', []);

catalogue.controller('CatalogueController', function($scope, $rootScope, $location, $anchorScroll, $routeParams,  Product) {

    Product.get('CAKES').success(function(data) {
        //$scope.cakes = data;
        //[[c1,c2,c3], [c4,c5,c6]]
        $scope.cakes = chunk(data, 3);
    });

    Product.get('CUPCAKES').success(function(data) {
        $scope.cupcakes = chunk(data, 3);
    });

    Product.get('MACARONS').success(function(data) {
        $scope.macarons = chunk(data, 3);
    });

    Product.get('TREATS').success(function(data) {
        $scope.treats = chunk(data, 3);
    });

    function chunk(arr, size) {
        var newArr = [];
        for (var i=0; i<arr.length; i+=size) {
            newArr.push(arr.slice(i, i+size));
        }
        return newArr;
    }

    //$scope.$on('$viewContentLoaded', function(newRoute, oldRoute) {
    //    $location.hash($routeParams.categoryId);
    //    $anchorScroll();
    //});


    //$scope.getCakes = function() {
    //    Product.get('cakes').success(function(data) {
    //        $scope.cakes = data;
    //    });
    //};
});

//catalogue.run(function($rootScope, $location, $anchorScroll, $routeParams) {
//    $rootScope.$on('$viewContentLoaded', function(newRoute, oldRoute) {
//        $location.hash($routeParams.scrollTo);
//        $anchorScroll();
//    });
//})