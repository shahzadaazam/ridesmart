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

.controller('GalleryController', function($scope, $ionicPlatform, $cordovaCamera) {

  $scope.photos = [];

  $scope.getPhoto = function(){
    var x = document.getElementById("main");
    x.style.backgroundColor = "white";

    var srcType = navigator.camera.PictureSourceType.SAVEDPHOTOALBUM;

    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: navigator.camera.EncodingType.JPEG,
        mediaType: navigator.camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true  //Corrects Android orientation quirks
    }

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        console.log(imageUri);
        // $scope.photos.unshift(imageUri);
        alert('Image URL is: ' + imageUri);
        alert('Scope photos: ' + $scope.photos);
        //var image = document.getElementById ('picture');
        //image.src = "data:image/jpeg;base64," + imageUri;
        //displayImage(imageUri);
        // You may choose to copy the picture, save it somewhere, or upload.
        //func(imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);

    // //Hiding ezar camera for gallery
    // $ionicPlatform.ready(function(){
    //   $cordovaCamera.getPicture({
    //     destinationType: navigator.camera.DestinationType.FILE_URL,
    //     sourceType: navigator.camera.PictureSourceType[type.toUpperCase()]
    //   }).then(function(photo){
    //     $scope.photos.unshift(photo);
    //   }, function(err){
    //     console.log(err);
    //   });
    // });
  }

});
