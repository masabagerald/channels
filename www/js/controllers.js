angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ProductsCtrl', function($scope,products) {
  $scope.products = products;
})

.controller('ProductCtrl', function($scope, product, $ionicLoading, CartService, $ionicPopup) {
  $scope.product = product;

      $scope.addToCart = function() { 

      $ionicLoading.show({template : 'Adding to cart...'});

      CartService.add([{
          product_id: $scope.product.id,
          quantity: 1
        }])
        .then(function(cart){
          $ionicLoading.hide();
          $ionicPopup.alert({
              title: 'Message',
              template: 'The item was added to cart'
          });
        })
        .catch(function(error){
          $ionicLoading.hide();
          $ionicPopup.alert({
              title: "Error",
              template: "An error has occurred, please try again."
          })
        })
    }



})

.controller('CartCtrl',function($scope,cart){
  $scope.cart = cart;
})

