let upvotenumber = 0;
let downvotenumber = 0;
// In the following example, markers appear when the user clicks on the map.


var labelIndex = 0;
var customStyle = [{
    featureType: "poi",
    elementType: "labels",
    stylers: [{
        visibility: "off"
    }]
}];

var markers = [];
var uniqueId = 1;

let reportButtonClicked = false;
let currentClickPosition;

/**
 * Initialize Google Maps.
 */
function initialize() {
    var BCIT = {
        lat: 49.2482,
        lng: -123
    };
    var BCIT_BOUNDS = {
        north: 49.255864,
        south: 49.241061,
        west: -123.004939,
        east: -122.995592
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        minZoom: 15.8,
        center: BCIT,
        restriction: {
            latLngBounds: BCIT_BOUNDS,
            strictBounds: false
        }
    });


    db.collection("hazards").where("marker", "==", true)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var marker = new google.maps.Marker({
                    position: doc.data().position,
                    map: map,
                });
                marker.setMap(map);

                //Set unique id
                marker.id = uniqueId;
                uniqueId++;
                markers.push(marker);

                google.maps.event.addListener(marker, "click", function (e) {
                    var content = '<div id="iw-container">' +
                        '<div class="iw-title">' +
                        '<div><p>Hazard Descriptions</p></div>' +
                        '<img class="sign" src="images/snow.png">' +
                        '</div>' +
                        '<div class="iw-content">' +
                        '<div class="iw-subTitle">Jimmy Reports</div>' +
                        '<p>Snow develops in clouds that themselves are part of a larger weather system. The physics of snow crystal development in clouds results from a complex set of variables that include moisture content and temperatures. The resulting shapes of the falling and fallen crystals can be classified into a number of basic shapes and combinations, thereof. Occasionally, some plate-like, dendritic and stellar-shaped snowflakes can form under clear sky with a very cold temperature inversion present.</p>' +
                        '<div class="iw-subTitle">More Reports</div>' +
                        '<br>Snow develops in clouds that themselves are part of a larger weather system. The physics of snow crystal development in clouds results from a complex set of variables that include moisture content and temperatures. The resulting shapes of the falling and fallen crystals can be classified into a number of basic shapes and combinations, thereof. Occasionally, some plate-like, dendritic and stellar-shaped snowflakes can form under clear sky with a very cold temperature inversion present.</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="modal-footer" style="display:flex ; justify-content: space-around;" >' +
                        '<img class="sign" src="images/upvote.png" onclick="upvotefun();">' +
                        '<p id="upvote" style="font-size: 20px; padding-left:10px;">0</p>' +
                        '<img class="sign" src="images/downvote.png" onclick="downvotefun();">' +
                        '<p id="downvote" style="font-size: 20px;  padding-left:10px;">0</p>' +
                        '</div>';
                    content +=
                        '<div class="modal-footer" style="display:flex ; justify-content: space-around;" >' +
                        "<button type = 'button' class='btn btn-secondary' style='text-align:center;' value = 'Delete' onclick = 'DeleteMarker(" +
                        marker.id +
                        ");'>Delete</button>" +
                        '</div>';

                    var InfoWindow = new google.maps.InfoWindow({
                        content: content,
                        maxWidth: 350
                    });
                    InfoWindow.open(map, marker);
                });
            });
        })




    document.getElementById("report-btn").onclick = reportClicked;

    //TEST CODE - NEW VARIABLE FOR SAVING DATA LAT AND LNG
    var testDataJASON = {lat: null, lng: null};

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function (event) {
        reportHazard(event.latLng);

        //TEST CODE - NEW VARIABLE FOR SAVING DATA LAT AND LNG
        testDataJASON.lat = event.latLng.lat();
        testDataJASON.lng = event.latLng.lng();
        console.log(testDataJASON.lat);
        console.log(testDataJASON.lng);

    });
    map.set("styles", customStyle)
}

/**
 * 'Report' button is clicked.
 */
function reportClicked() {

    reportButtonClicked = true;
}

function reportHazard(location) {
    if (reportButtonClicked) {
        currentClickPosition = location;
        console.log(currentClickPosition.toString());
        window.open("reportHazard.html");
        reportButtonClicked = false;

    }
}

/**
 * Adds a hazard to the map.
 * @param {*} location location of click
 * @param {*} map to add
 */


function addMarker(hazard, map) {


    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var icon1 =
        'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
     var   marker = new google.maps.Marker({
        position: hazard.position,
        label: labels[labelIndex++ % labels.length],
        map: map,
        icon: icon1,

    });

    //activate popup window
    //$("#reportHazard").modal();

    /*$("#button1").click(function () {
        $("#reportHazard").modal("hide");
    });*/
    //window.open("reportHazard.html");


    reportButtonClicked = false;
}

/**
 * Find and remove the hazard from the map.
 * @param {number} id to delete
 */
function DeleteMarker(id) {
    //Find and remove the marker from the Array
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id == id) {
            //Remove the marker from Map                  
            markers[i].setMap(null);

            //Remove the marker from array.
            markers.splice(i, 1);

            return;
        }
    }
};

/**
 * Upvote a hazard.
 */
function upvotefun() {
    upvotenumber += 1;
    document.getElementById("upvote").innerHTML = upvotenumber;
};

/**
 * Downvote a hazard.
 */
function downvotefun() {
    downvotenumber += 1;
    document.getElementById("downvote").innerHTML = downvotenumber;
};

//OLD LOGIN FUNCTION
//activate login window
// $("#loginwindow").modal();

// $("#button2").click(function () {
//     $("#loginwindow").modal("hide");
// });
//activate login window