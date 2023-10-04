// Initialize the map
var map = L.map('map').setView([-3.56518,143.619995], 5); // Use Wewak, New Guinea as the initial center

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Global variable for modal
var modal = document.getElementById("myModal");
// Global variable for markerArray
var markerArray = [];
// Global variable for grabbed
var grabbed = [];
// Global variable for health bar count
var grabbedMarkersCount = 0;
var grabbedMarkers = 0;

// Click event for labels
function openModal() {
    modal.style.display = "block";
    displayRecordData(this.recordData);
}

// Player
let playerLevel = 1;
const EXPERIENCE_TO_LEVEL_UP = 3; // Level up every 3 experience points

// Close button
var closeButton = document.querySelector(".close");

// Close the modal
closeButton.addEventListener("click", function() {
    modal.style.display = "none";
});

// Display the record's URL
function displayRecordData(textContent, image, title) {
    var modelContent = document.querySelector(".model-content p");
    var modelPicture = document.querySelector(".model-content img");
    var modelTitle = document.querySelector(".model-content h1");
    modelContent.textContent = textContent;
    if (image != null) {
        modelPicture.src = image;
    } else {
        modelPicture.alt = "No pictures";
    }
    modelTitle.textContent = title;
}

// Update health bar
function updateHealthBar() {
    let experiencePercentage = (grabbedMarkersCount / EXPERIENCE_TO_LEVEL_UP) * 100;
    document.querySelector('.progress').style.width = experiencePercentage + '%';

    // Check for level up
    if (grabbedMarkersCount >= EXPERIENCE_TO_LEVEL_UP) {
        playerLevel++;
        grabbedMarkersCount = 0;
        document.querySelector('.level').textContent = 'Level' + playerLevel;
        document.querySelector('.progress').style.width = '0%'; // Reset the progress bar
    }
}

// Event triggered, send AJAX request to PHP
function handleMarkerClick(url, image, marker) {
    var isGrab = marker.isGrab;
    $.ajax({
        url: "mvp.php",
        method: "POST",
        data: { urlToFetch: url },
        success: function(response) {
            // Remove unwanted content
            response = response.replace(/\[an error occurred while processing this directive\]/g, '');
            let $content = $(response);
            let title = $content.filter("title").text();
            let textContent = $content.find('div#page > div#main > div#col1 > div#col1_content > div.module.content_12col > div.container > div.story > div.story_body.description').text();
            displayRecordData(textContent, image, title);
            
            // Update health bar
            if (!isGrab) {
                grabbedMarkersCount++;
                grabbedMarkers++;
                updateHealthBar(grabbedMarkersCount);

                // Add to unlocked array
                var object = {
                    title: title,
                    image: image,
                    url: url,
                    grabbedMarkersCount: grabbedMarkers
                };
                grabbed.push(object);
                console.log("grabbed: " + grabbed);
            }
            marker.isGrab = true;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        }
    });
}

// Save data and send to server
function sendUrlsToServer() {
    $.ajax({
        url: "storageData.php",
        method: "POST",
        data: { grabbed: JSON.stringify(grabbed) },
        success: function(response) {
            console.log("URLs stored successfully:", response);
        },
        error: function(error) {
            console.error("Error storing URLs:", error);
        }
    });
}

// Periodic save, every 3 seconds
setInterval(sendUrlsToServer, 3 * 1000);

// Add markers to map
function addPointToMap(lat, lon, recordValue) {
    var marker = L.marker([lat, lon]).addTo(map);
    marker.isGrab = false;
    var supportClick = false;
    markerArray.push(marker);
    marker.recordData = recordValue.URL;
    marker.image = recordValue['Primary image'];

    // Click event
    marker.on("click", function(e) {
        // Show confirmation dialog
        showConfirmationPopup(e.target, function(result) {
            supportClick = result;
            if (supportClick) {
                openModal.call(marker);
                handleMarkerClick(this.recordData, this.image, marker);
                marker.setIcon(customIcon);
            }
        }.bind(this));
    });
}

// Confirmation dialog
function showConfirmationPopup(clickedMarker, callback) {
    var popupContent = `
        <p>Dig now?</p>
        <button id="startGrab">Sure</button>
        <button id="noGrab">Not yet</button>
    `;

    clickedMarker.bindPopup(popupContent).openPopup();
    document.getElementById("startGrab").addEventListener('click', function() {
        if (typeof callback === "function") {
            callback(true);
        }
        clickedMarker.closePopup();
        clickedMarker.unbindPopup();
    });

    document.getElementById("noGrab").addEventListener('click', function() {
        clickedMarker.closePopup();
        if (typeof callback === "function") {
            callback(false);
        }
    });
}

// Function to process and iterate over the records from the dataset
function iterateRecords(data) {
    $.each(data.result.records, function(recordKey, recordValue) {
        // Define the suburbs in Brisbane to be included
        const brisbaneSuburbs = [
            "Brisbane","Brisbane-City","South Brisbane", "West End","Fortitude Valley","Woolloongabba","Indooroopilly",
            ,"Toowong","Chermside","Fairfield", "Milton","South Bank", "Wynnum", "Lytton",
            "Albion","Bowen Hills","Herston", "New Farm","Taringa","Annerley", "Ashgrove","Bardon", "Bulimba", "Kangaroo Point",
            "Kelvin Grove", "Mount Gravatt"
        ];

        // Check if the current record is from the suburbs in the list
        if(brisbaneSuburbs.includes(recordValue.Place)){
            var latitude = recordValue.Latitude + (Math.random() * 0.2 - 0.1)
            var Longitude = recordValue.Longitude + (Math.random() * 0.2 - 0.1)

            // If valid latitude and longitude are present, add a point to the map
            if(latitude && Longitude) {
                addPointToMap(latitude, Longitude, recordValue)
            }  
        }
    })
}

// Initialize once the document is ready
$(document).ready(function() {

    var data = {
        resource_id: "d73f2a2a-c271-4edd-ac45-25fd7ad2241f", // To change to a different dataset, modify the resource_id
        limit: 8500,
    }

    // Fetch coordinates and add markers to the map
    $.ajax({
        url: "https://data.gov.au/data/api/3/action/datastore_search", // Change the URL if fetching data from a different portal
        data: data,
        dataType: "jsonp", // Use "jsonp" to ensure AJAX works correctly locally (prevents cross-site scripting issues)
        cache: true,
        success: function(data) {
            iterateRecords(data);
        }
    });      
});

// Event listener for when the document is fully loaded
document.addEventListener("DOMContentLoaded", function(){
    // Any additional functionality to run once the document is loaded can be added here
});

// Function to show the current location of the user on the map
function showCurrent() {
    if (navigator.geolocation) {        
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = L.latLng(position.coords.latitude, position.coords.longitude);
            L.marker([position.coords.latitude, position.coords.longitude], {icon: userIcon}).addTo(map);
            // Center and zoom the map to the user's location
            map.setView(pos, 13);

            // Set opacity based on the distance of markers from the user
            markerArray.forEach(function(marker) {
                var distance = pos.distanceTo(marker.getLatLng());
                if (distance <= 10*200) {
                    marker.setOpacity(1);
                } else if (distance <= 10*400) {
                    marker.setOpacity(0.5);
                } else {
                    marker.setOpacity(0);
                }
            });
        });
    } else {
        alert("Unable to determine your location.");
    }
}

// Format for custom marker icons
var customIcon = L.icon({
    iconUrl: 'icon.png',    // URL for the icon image
    iconSize: [50, 50],     // Size of the icon
    iconAnchor: [22, 94],   // The anchor point of the icon to align with the map coordinates
    popupAnchor: [-3, -76]  // Anchor point for the popup if you want to add one for this marker
});

// Format for user marker icon
var userIcon = L.icon({
    iconUrl: 'user.png',
    iconSize: [60, 60],     // Size of the icon
    iconAnchor: [22, 94],   // The anchor point of the icon to align with the map coordinates
});

