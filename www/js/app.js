
angular.module('ridesmart', ['ionic', 'ngCordova', 'ionic.contrib.ui.hscrollcards'])

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
  $scope.MAX_FACES = 5;
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
    {id: '0', name: 'Blue Helmet', class: 'helmetblue', image: 'bluehelmet.png'},
    {id: '1', name: 'Green Helmet', class: 'helmetgreen', image: 'greenhelmet.png'},
    {id: '2', name: 'Yellow Helmet', class: 'helmetyellow', image: 'yellowhelmet.png'},
    {id: '3', name: 'Red Helmet', class: 'helmetred', image: 'redhelmet.png'},
    {id: '4', name: 'Green Helmet 2', class: 'helmetgreen2', image: 'greenhelmet2.png'},
    {id: '5', name: 'Pink Helmet', class: 'helmetpink', image: 'pinkhelmet.png'},
    {id: '6', name: 'Purple Helmet', class: 'helmetpurple', image: 'purplehelmet.png'},
    {id: '7', name: 'Red Helmet 2', class: 'helmetred2', image: 'redhelmet2.png'},
    {id: '8', name: 'Cruiser', class: 'cruiser', image: 'cruiser.png'},
    {id: '9', name: 'Red Cruiser', class: 'redcruiser', image: 'redcruiser.png'},
    {id: '10', name: 'Scooter', class: 'scooter', image: 'scooter.png'},
    {id: '11', name: 'Red Scooter', class: 'redscooter', image: 'redscooter.png'},
    {id: '12', name: 'Sportbike', class: 'sportbike', image: 'sportbike.png'},
    {id: '13', name: 'Red Sportbike', class: 'redsportbike', image: 'redsportbike.png'},
    {id: '14', name: 'Touring Bike', class: 'touringbike', image: 'touringbike.png'},
    {id: '15', name: 'Red Touring Bike', class: 'redtouringbike', image: 'redtouringbike.png'}
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

                   window.addEventListener("orientationchange", function(){
                    console.log(window.orientation);
                    console.log(screen.orientation.type);
                    screen.orientation.lock('portrait');
                    $scope.enableFaceUpdate = false;
                    for (var i=0; i < $scope.MAX_FACES; i++) {
                      $scope.faceEls[i].style.display = "none";
                    }
                    setTimeout(
                      function() { $scope.enableFaceUpdate = true;},
                      2000);
                  }, false);
                  //console.log(faces.length);
                  if (!$scope.enableFaceUpdate || !faces || faces.length == 0) {
                    faceCnt = 0;
                  } else {
                    faceCnt = Math.min(faces.length,$scope.MAX_FACES);
                  }
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

    //Helper function to update mask placement coordinates. This is called as a success function for ezar watchFaces API call

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
  $scope.selectMask = function (maskid) {
    // var x = document.getElementById("main");
    // x.style.backgroundColor = "transparent";
    // alert('Mask selected is ' + $scope.selectedMask.class);
    console.log('select mask button pressed');
    console.log('selected mask is: ' + $scope.selectedMask.class);
    console.log('maskid passed is: ' + maskid);
    $scope.selectedMask = $scope.masks[maskid];
    document.getElementById('face0').className = $scope.selectedMask.class;
    console.log('selected mask is: ' + $scope.selectedMask.class);
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
    // document.getElementById('maskselection').style.display = "none";
    document.getElementById('scroller').style.display = "none";
    //window.localStorage.clear();

    setTimeout( function() {
      ezar.snapshot(
        function() {
          document.getElementById('revcamera').style.display = "block";
          document.getElementById('snapshot').style.display = "block";
          document.getElementById('footerbground').style.display = "block";
          document.getElementById('gallerybutton').style.display = "block";
          // document.getElementById('maskselection').style.display = "block";
          document.getElementById('scroller').style.display = "block";


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


.controller('ImagesController', function($scope, $stateParams, $cordovaSocialSharing, $location) {

  console.log('image controller');
  console.log($stateParams);
  $scope.picture = { image: $stateParams.index } ;
  $scope.photo = "/storage/emulated/0/Pictures/"+$stateParams.index+".jpg";
  console.log("params is: " + $stateParams.index);
  console.log("image path is: " + $scope.photo);

  $scope.OtherShare=function(image){
    console.log("image is: " + image);
    window.plugins.socialsharing.share(null, null, "file:///storage/emulated/0/Pictures/"+ image +".jpg");
  }

  $scope.DeleteImage=function(image){
    window.localStorage.removeItem(image);
    $location.path('/gallery');
  }
});
