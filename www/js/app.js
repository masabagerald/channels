// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.run(function(CartService){



  var promise = null;

  if (window.localStorage['marketcloud.cart_id']){
    promise = CartService.getById(window.localStorage['marketcloud.cart_id']);
  }
  else{
    promise = CartService.create([]);
  }

  promise
  .then(function(data){
    window.localStorage['marketcloud.cart_id'] = data.id;
  })
  .catch(function(err){
    console.log("Unable to init the cart")
  })

})


.factory('marketcloud',function(){
  marketcloud.public = '86837aa0-1a7c-4ec2-848a-ce51fed364e3';
  return marketcloud;
})
.service('DataService',['$q','marketcloud',function($q,marketcloud){
  return {
    list : function(query){
     return $q(function(resolve,reject){
        marketcloud.products.list(query || {},function(err,product){
          if (err)
            reject(err);
          else
            resolve(product);
        })
      })

    },
    getById : function(id) {
      return $q(function(resolve,reject){
        marketcloud.products.getById(id,function(err,product){
          if (err)
            reject(err);
          else
            resolve(product)
        })
      })
    }
  }
}])

.service('CartService',function(marketcloud,$q){
  return {
    data : null,
    // Returns a cart by id
    getById : function(id) {
      var _this = this;
      return $q(function(resolve,reject){
        marketcloud.carts.getById(id,function(err,cart){
          if (err)
            reject(err)
          else{
            _this.data = cart;
            resolve(cart)
          }
        })
      })
    },
    //Creates a new cart
    create : function(items) {
      var _this = this;

      return $q(function(resolve,reject){
        marketcloud.carts.create(items || [],function(err,cart){
          if (err)
            reject(err)
          else{
            _this.data = cart;
            resolve(cart)
          }
        })
      })
    },
    //Add items to cart
    add : function(items) {
      var _this = this;
      if (!this.data)
        throw new Error("Cart must be initialized first!")
      return $q(function(resolve,reject){
        marketcloud.carts.add(_this.data.id,items,function(err,cart){
          if (err)
            reject(err)
          else{
            _this.data = cart;
            resolve(cart)
          }
        })
      })
    },
    //Updates cart's contents
    update : function(update) {
      var _this = this;
      if (!this.data)
        throw new Error("Cart must be initialized first!")
      return $q(function(resolve,reject){
        marketcloud.carts.update(_this.data.id,update,function(err,cart){
          if (err)
            reject(err)
          else{
            _this.data = cart;
            resolve(cart)
          }
        })
      })
    },
    //removes items from the cart
    remove : function(items) {
      var _this = this;
      if (!this.data)
        throw new Error("Cart must be initialized first!")
      return $q(function(resolve,reject){
        marketcloud.carts.remove(_this.data.id,items,function(err,cart){
          if (err)
            reject(err)
          else{
            _this.data = cart;
            resolve(cart)
          }
        })
      })
    },
  }
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })
  .state('app.cart', {
      url: '/cart',
      views: {
        'menuContent': {
          templateUrl: 'templates/cart.html',
          controller: 'CartCtrl'
        }
      },
      resolve:{
        cart : function(CartService) {
          return CartService.getById(window.localStorage['marketcloud.cart_id'])
        }
      }
  })
  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.products', {
      url: '/products',
      views: {
        'menuContent': {
          templateUrl: 'templates/products.html',
          controller: 'ProductsCtrl'
        }
      },
      resolve: {
        products : function(DataService,$stateParams){
          return DataService.list($stateParams || {})
        }
      }
    })

  .state('app.product', {
    url: '/products/:productId',
    views: {
      'menuContent': {
        templateUrl: 'templates/product.html',
        controller: 'ProductCtrl'
      }
    },
    resolve: {
        product : ['DataService','$stateParams',function(DataService,$stateParams){
                  return DataService.getById($stateParams.productId)
                }]
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
