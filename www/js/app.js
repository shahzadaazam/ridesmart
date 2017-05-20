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
  })

  // .state('share', {
  //   url: "/share/:index",
  //   templateUrl: "views/share.html",
  //   controller: 'ShareController'
  // })

  .state('image', {
    cache: false,
    url: '/image/:index',
    templateUrl: 'views/image.html',
    controller: 'ImagesController'
  });

  $urlRouterProvider.otherwise('/');

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
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

.controller('MasksController', ['$scope', function($scope, $ionicPlatform) {

  //YET TO IMPLEMENT ORIENTATION CHANGE!!

  //Local variables global to MasksController
  $scope.enableFaceUpdate = false;
  $scope.MAX_FACES = 1;
  $scope.faceEls = [];
  $scope.vdol=false;

  //Making ezar video overlay visible on view load
  var x = document.getElementById("main");
  x.style.backgroundColor = "transparent";
  // console.log("local storage length is:" + window.localStorage.length);

  //Setting background image of gallery button to latest image or icon if nothing is present in the gallery
  if (window.localStorage.length > 0){
    var key = window.localStorage.key(window.localStorage.length - 1);
    var galleryButton = document.getElementById("gallerybutton");
    galleryButton.style.backgroundImage = 'url(/storage/emulated/0/Pictures/' + window.localStorage.getItem(key) + '.jpg)';
    galleryButton.style.border = 'none';
    // console.log(galleryButton.style.backgroundImage);
    var galleryIcon = document.getElementById("galleryicon").className = 'none';
  }
  else{
    var galleryButton = document.getElementById("gallerybutton");
    galleryButton.style.backgroundImage = 'none';
    // console.log(galleryButton.style.backgroundImage);
  }

  //Loading masks to scope
  $scope.masks = [
    {id: '1', name: 'Ridesmart Shades', class: 'shades'},
    {id: '2', name: 'Anonymous', class: 'anonymous'}
  ];

  //Setting first mask to load to 0
  $scope.selectedMask = $scope.masks[0];

  //Running face detection, tracking and mask positioning
  //$scope.init = function(){
    for (var i=0; i < $scope.MAX_FACES; i++) {
      $scope.faceEls.push(document.getElementById('face'+i));
    }

    // console.log($scope.faceEls[0]);

    console.log('initing overlay');
    setTimeout(function(){
      ezar.initializeVideoOverlay(
        function() {
          ezar.getFrontCamera().start(
            setTimeout(
              function() {
                ezar.watchFaces(function(faces){
                  var faceCnt, face, faceEl;

                  //console.log("i am success");
                  //console.log(faces.length);
                  if (!$scope.enableFaceUpdate || !faces || faces.length == 0) {
                    faceCnt = 0;
                  } else {
                    faceCnt = Math.min(faces.length,$scope.MAX_FACES);
                  }
                  //faceCnt = 1;
                  console.log('face cnt '+faceCnt)
                  for (var i=0; i < faceCnt; i++) {
                    face = faces[i];
                    faceEl = $scope.faceEls[i];

                    //console.log(face.right);
                    //console.log(face.left);
                    faceEl.style.width = (face.right - face.left) + "px";
                    faceEl.style.height = (face.bottom - face.top) + "px";
                    faceEl.style.left = face.left + "px";
                    faceEl.style.top = face.top + "px";
                    faceEl.style.display = "block";
                  }
                  //console.log('calling on faces');
                  //console.log(faceEl.style.width);
                  for (var i=faceCnt; i < $scope.MAX_FACES; i++) {
                    var faceEl = $scope.faceEls[i];
                    faceEl.style.display = "none";
                  }
                },$scope.err());
                $scope.enableFaceUpdate = true;
              }, 500),
              $scope.err1());
            }, $scope.err2());
          },1500);
    //$scope.vdol=true;
    //}
    //}
    //else{
      //alert('in window.ezar else');
      //alert(window.ezar);
    //}
    //console.log(ezar.isVideoOverlayInitialized());
  //}

  //$scope.init();
    //Helper function to update mask placement coordinates. This is called as a success function for ezar watchFaces API call
     /*this.onFaces = function(faces){
      var faceCnt, face, faceEl;

      console.log("i am success");
      console.log(faces.length);
      if (!$scope.enableFaceUpdate || !faces || faces.length == 0) {
        faceCnt = 0;
      } else {
        faceCnt = Math.min(faces.length,$scope.MAX_FACES);
      }
      faceCnt = 1;
      console.log('face cnt '+faceCnt)
      for (var i=0; i < faceCnt; i++) {
        face = faces[i];
        faceEl = $scope.faceEls[i];

        console.log(face.right);
        console.log(face.left);
        faceEl.style.width = (face.right - face.left) + "px";
        faceEl.style.height = (face.bottom - face.top) + "px";
        faceEl.style.left = face.left + "px";
        faceEl.style.top = face.top + "px";
        faceEl.style.display = "block";
      }
      console.log('calling on faces');
      //console.log(faceEl.style.width);
      for (var i=faceCnt; i < $scope.MAX_FACES; i++) {
        var faceEl = $scope.faceEls[i];
        faceEl.style.display = "none";
      }
    }*/

    //Helper function. Ths is called as a fail function for ezar watchFaces API call
    $scope.err = function(msg){
      //wrap alert in timeout to make it a macro task
      //android: https://www.chromestatus.com/features/5647113010544640
      setTimeout(
        function() {
          console.log("Error: I'm here" + msg);
          //alert("Error: I'm here" + msg);
        },1);
    }

    $scope.err1 = function(msg){
      //wrap alert in timeout to make it a macro task
      //android: https://www.chromestatus.com/features/5647113010544640
      setTimeout(
        function() {
          console.log("Error1: I'm here" + msg);
          //alert("Error1: I'm here" + msg);
        },1);
    }

    $scope.err2 = function(msg){
      //wrap alert in timeout to make it a macro task
      //android: https://www.chromestatus.com/features/5647113010544640
      setTimeout(
        function() {
          console.log("Error2: I'm here" + msg);
          //alert("Error2: I'm here" + msg);
        },1);
    }

  //Select Mask function
  $scope.selectMask = function () {
    // var x = document.getElementById("main");
    // x.style.backgroundColor = "transparent";
    // alert('Mask selected is ' + $scope.selectedMask.class);
    document.getElementById('face0').className = $scope.selectedMask.class;
  }

  //Snapshot function
  $scope.snapshot = function(){

    var snapping = false;
    console.log('snapshot');
    snapping = true;
    var rand=(new Date).getTime();//Math.random().toString(36).substring(10);

    document.getElementById('revcamera').style.display = "none";
    document.getElementById('snapshot').style.display = "none";
    document.getElementById('footerbground').style.display = "none";
    document.getElementById('gallerybutton').style.display = "none";
    document.getElementById('maskselection').style.display = "none";
    //window.localStorage.clear();

    setTimeout( function() {
      ezar.snapshot(
        function() {
          document.getElementById('revcamera').style.display = "block";
          document.getElementById('snapshot').style.display = "block";
          document.getElementById('footerbground').style.display = "block";
          document.getElementById('gallerybutton').style.display = "block";
          document.getElementById('maskselection').style.display = "block";


          window.localStorage.setItem(rand,rand);
          console.log('saving');
          console.log(window.localStorage.getItem(rand));
          console.log(window.localStorage.length);
          snapping = false;
        },
        function(err) {
          console.log('snapping error');
          snapping = false;
        },

        {name: rand,
          "saveToPhotoAlbum": true,
          "includeWebView": true,
          "includeCameraView": true
        }

      );
    },10);
  }

  //Function for orientation change
  $scope.orientationChange = function(){
    $scope.enableFaceUpdate = false;
    for (var i=0; i < $scope.MAX_FACES; i++) {
      $scope.faceEls[i].style.display = "none";
    }
    setTimeout(
      function() { $scope.enableFaceUpdate = true;},
      2000);
  }

  //Reverse camera function
  $scope.reverseCamera = function () {
    setTimeout(function() {
      //your code to be executed after 1/2 second
      console.log('reverse camera');
      console.log(ezar.getActiveCamera().getPosition());
      var newCamera = ezar.getActiveCamera().getPosition() == 'FRONT' ? ezar.getBackCamera() : ezar.getFrontCamera();
      newCamera.start();
    }, 500);
  }

}])


.controller('GalleryController', function($scope, $stateParams) {

  $scope.photos = [];

  console.log('gallery controller');
  //console.log(ezar.isVideoOverlayInitialized());

  $scope.getPhoto = function(){
    ezar.clearFacesWatch(
    function() {
      console.log('faces cleared');
    },
    function(error) {
      alert("clearFaces failed");
    });
    var x = document.getElementById("main");
    x.style.backgroundColor = "white";

    // var s = cordova.file.externalDataDirectory;
    // var t = s.replace("Android/data/com.ezartech.demo.ezarfacedetect/files/", "Pictures/");
    // $ionicPopup.show({title: t});
    //
    // for(var i = 1; i < 100; i++) {
    //   //change the following path to pick specific images. Have to change the following to pick all images from the album
    // $scope.photos.push({id: i, src: t + "1(" + i + ").jpg"});
    var output = [];
    for(var i = 0; i < window.localStorage.length; i++) {
      var key = window.localStorage.key(i);
      output.push(window.localStorage.key(i));
      //console.log(key);
      //change the following path to pick specific images. Have to change the following to pick all images from the album
      //$scope.photos.push({id: i, src: "/storage/emulated/0/Pictures/" + window.localStorage.getItem(key) + ".jpg"});

    }
    for (var j=(output.length-1);j >= 0; j--) {
      //console.log(output[j]);
      $scope.photos.push({id: output[j], src: "/storage/emulated/0/Pictures/" + output[j] + ".jpg"});
    }

  }

})

// .controller('ShareController', function($scope, $stateParams) {
//
//   console.log('share controller');
//
//   $scope.photo = { image: $stateParams.index } ;
//   console.log('stateParams: ' + $stateParams);
//   console.log('image path: ' + $stateParams.index);
//
//   // $scope.whatsappShare=function(){
//   //   window.plugins.socialsharing.shareViaWhatsApp('Digital Signature Maker', null /* img */, $scope.photo /* url */, null, function(errormsg){alert("Error: Cannot Share")});
//   // }
//   // $scope.twitterShare=function(){
//   //   window.plugins.socialsharing.shareViaTwitter('Digital Signature Maker', null /* img */, $scope.photo, null, function(errormsg){alert("Error: Cannot Share")});
//   // }
//   $scope.OtherShare=function(){
//      window.plugins.socialsharing.share(null, null, "file:///storage/emulated/0/Pictures/"+$stateParams.index+".jpg");
//   }
//
// })

.controller('ImagesController', function($scope, $stateParams, $cordovaSocialSharing) {

  // var photo;
  // var self = this;
  // $scope.key = $routeParams.index;
  // console.log("params is: " + $scope.key);

  // var value = window.localStorage.key($scope.key);
  // console.log("image value is: " + value);
  console.log('image controller');
  console.log($stateParams);
  //console.log();
  $scope.picture = { image: $stateParams.index } ;
  $scope.photo = "/storage/emulated/0/Pictures/"+$stateParams.index+".jpg";
  console.log("params is: " + $stateParams.index);
  console.log("image path is: " + $scope.photo);

  $scope.OtherShare=function(image){

    console.log("image is: " + image);
    window.plugins.socialsharing.share(null, null, "file:///storage/emulated/0/Pictures/"+ image +".jpg");
  }

});
