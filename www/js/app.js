// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ridesmart', ['ionic', 'ngCordova'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    cache: false,
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'MasksController'
  })

  .state('gallery', {
    cache: false,
    url: '/gallery',
    templateUrl: 'views/gallery.html',
    controller: 'GalleryController'
  });

  $urlRouterProvider.otherwise('/');

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('MasksController', ['$scope', function($scope) {

  //Making ezar video overlay visible on view load
  var x = document.getElementById("main");
  x.style.backgroundColor = "transparent";

  $scope.masks = [
    {id: '1', name: 'Ridesmart Shades', class: 'shades'},
    {id: '2', name: 'Anonymous', class: 'anonymous'}
  ];

  $scope.selectedMask = $scope.masks[0];

  $scope.selectMask = function () {
    // var x = document.getElementById("main");
    // x.style.backgroundColor = "transparent";
    // alert('Mask selected is ' + $scope.selectedMask.class);
    document.getElementById('face0').className = $scope.selectedMask.class;
  }

}])

.controller('GalleryController', function($scope, $ionicPlatform) {

  $scope.photos = [];

  $scope.getPhoto = function(){
    var x = document.getElementById("main");
    x.style.backgroundColor = "white";

    for(var i = 0; i < window.localStorage.length; i++) {
      key = window.localStorage.key(i);
      console.log(key);
      //change the following path to pick specific images. Have to change the following to pick all images from the album
    $scope.photos.push({id: i, src: "/storage/emulated/0/Pictures/" + window.localStorage.getItem(key) + ".jpg"});
    }
  }

});
