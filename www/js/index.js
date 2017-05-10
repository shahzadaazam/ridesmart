
var MAX_FACES = 1;
var faceEls = [];
var enableFaceUpdate = false;
var snapping = false;
document.addEventListener('deviceready',init, false);
        
function init() {        
    for (var i=0; i < MAX_FACES; i++) {
        faceEls.push(document.getElementById('face'+i));
    }

    var snap = document.getElementById('snapshot');
    snap.addEventListener('click',snapshot,false);  
        
    var rev = document.getElementById('revcamera');
    rev.addEventListener('click',reverseCamera,false);

    var gal = document.getElementById('gallerybutton');
    gal.addEventListener('click',getGallery,false);

    setTimeout(function(){
    ezar.initializeVideoOverlay(
        function() {
            ezar.getFrontCamera().start(
                setTimeout(
                    function() {
                        ezar.watchFaces(onFaces,err);
                        enableFaceUpdate = true;
                    }, 1500),
                err);
        }, err);
    },1500);    
}


function onFaces(faces) {
    var faceCnt, face, faceEl;

    //if (snapping) return;

    
    if (!enableFaceUpdate || !faces || faces.length == 0) {
        faceCnt = 0;
    } else {
        faceCnt = Math.min(faces.length,MAX_FACES);
    }
        
    for (var i=0; i < faceCnt; i++) {
        face = faces[i];
        faceEl = faceEls[i];
       
        faceEl.style.width = (face.right - face.left) + "px";
        faceEl.style.height = (face.bottom - face.top) + "px";
        faceEl.style.left = face.left + "px";
        faceEl.style.top = face.top + "px";
        faceEl.style.display = "block";
    }

    for (var i=faceCnt; i < MAX_FACES; i++) {
        var faceEl = faceEls[i];
        faceEl.style.display = "none";
    }
}

function err(msg) {
    //wrap alert in timeout to make it a macro task
    //android: https://www.chromestatus.com/features/5647113010544640 
    setTimeout(
        function() {
            alert("Error: " + msg);
        },0);
}

function orientationChange() {
    enableFaceUpdate = false;
    for (var i=0; i < MAX_FACES; i++) {
        faceEls[i].style.display = "none";
    }
    setTimeout(
        function() { enableFaceUpdate = true;},
        2000);
}


function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function getGallery() {

    var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    var options = setOptions(srcType);
    //var func = createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        console.log(imageUri);
        //var image = document.getElementById ('picture');
        //image.src = "data:image/jpeg;base64," + imageUri;
        //displayImage(imageUri);
        // You may choose to copy the picture, save it somewhere, or upload.
        //func(imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function snapshot() {
    console.log('snapshot');
    
    snapping = true;

    //showControls(false);
    document.getElementById('revcamera').style.display = "none";
    document.getElementById('snapshot').style.display = "none";
    document.getElementById('footerbground').style.display = "none";
    document.getElementById('gallerybutton').style.display = "none";
    document.getElementById('maskselection').style.display = "none";
    
    setTimeout( function() {
        ezar.snapshot(
            function() {
                //showControls(true);
                document.getElementById('revcamera').style.display = "block";
                document.getElementById('snapshot').style.display = "block";
                document.getElementById('footerbground').style.display = "block";
                document.getElementById('gallerybutton').style.display = "block";
                document.getElementById('maskselection').style.display = "block";
                snapping = false;
            },
            function(err) {
                console.log('snapping error');
                //showControls(true);
                snapping = false;
            },

            {"saveToPhotoAlbum": true, 
             "includeWebView": true,
             "includeCameraView": true
            }
             
            );
        },10);
}

function showControls(aBool) {
    var style = aBool ? 'block' : 'none';
    //setTimeout(
        //function() {
            //document.getElementById('controls').style.display = style;
           /* document.getElementById('revcamera').style.display = style;
            document.getElementById('snapshot').style.display = style;
            document.getElementById('gallerybutton').style.display = style;
            document.getElementById('footerbground').style.display = style;
            document.getElementById('maskselection').style.display = style;  */
        //}, 10);
}
 
function reverseCamera() {
    console.log('reverse camera');
    var newCamera =
        ezar.getActiveCamera().getPosition() == 'BACK' ? 
        ezar.getFrontCamera() : ezar.getBackCamera();
    newCamera.start();
}


window.addEventListener('orientationchange',orientationChange);


