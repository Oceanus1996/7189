// initialize map
var map = L.map('map').setView([-3.56518,143.619995], 5); // use Wewak, New Guinea as center

L.tileLayer('https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=b6bf392431654cfd9009af454cf8e333', {
    attribution: '&copy; Thunderforest, &copy; OpenStreetMap Contributors',
    maxZoom: 22
}).addTo(map);

//var modal
var modal = document.getElementById("myModal");
//var markerArray
var markerArray=[];
//var grabbed
var grabbed=[];
//var grabed count
var grabbedMarkersCount = 0;
var grabbedMarkers=0;
//var data
var storeData=[];
//username
var userName;
//click action
function openModal(){
    modal.style.display ="block";
    displayRecordData(this.recordData);}
// player
let playerLevel = 1;
const EXPERIENCE_TO_LEVEL_UP = 3; // level up each 3 digs
var currentNarration=0;
var currentCongration=0;


//close button
var closeButton = document.querySelector(".close");
//close
closeButton.addEventListener("click",function(){
    modal.style.display ="none";
});
//record the url
function displayRecordData(textContent,image,title){
    var  modelContent = document.querySelector(".model-content p")
    var  modelpicture = document.querySelector(".model-content img")
    var  modelTitle = document.querySelector(".model-content h1")
    modelContent.textContent = textContent;
    if(image != null){
        modelpicture.src = image;
    }else{
    }
    modelTitle.textContent= title;
}

//update experience bar
function updateHealthBar(){
    let experiencePercentage = (grabbedMarkersCount / EXPERIENCE_TO_LEVEL_UP) * 100;

    // update the width
    document.querySelector('.progress').style.width = experiencePercentage + '%';

    // check if level up
    if (grabbedMarkersCount >= EXPERIENCE_TO_LEVEL_UP) {
        playerLevel++;
        grabbedMarkersCount = 0;
        document.querySelector('.level').textContent = 'Level' + playerLevel;
        document.querySelector('.progress').style.width = '0%'; // exp bar turn grey
    }
    
};

//send ajax to php while act
function handleMarkerClick(url,image,marker){
    var isGrab =marker.isGrab;
    console.log(11,url);
    $.ajax({
        url:"mvp.php",
        method:"POST",
        data:{urlToFetch:url},
        success:function(response){
            response = response.replace(/\[an error occurred while processing this directive\]/g, '');
            let $content = $(response);
            let title = $content.filter("title").text();
            let textContent = $content.find('div#page > ' +
                                'div#main > ' +
                                'div#col1 > ' +
                                'div#col1_content > ' +
                                'div.module.content_12col > ' +
                                'div.container > ' +
                                'div.story > ' +
                                'div.story_body.description').text();

            displayRecordData(textContent,image,title);
            var markerExistsInStoreData =storeData.includes(marker.recordData);
            console.log("marker.recordValue",marker.recordData);   
            if (markerExistsInStoreData) {
                isGrab=true;
            } else {
                isGrab=false;
        
                storeData.push(marker.recordData);
            }
            //health bar
            if(!isGrab){
                grabbedMarkersCount++;
                grabbedMarkers++;
                updateHealthBar(grabbedMarkersCount);
                //add to grabbed 
                var object = {
                    title: title,
                    image: image,
                    url: url,
                    grabbedMarkersCount:grabbedMarkers
                };            
                grabbed.push(object);
            } else {
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        }
    });
}

//session
function sendUrlsToServer(username) {
    $.ajax({
        url: "storageData.php",
        method: "POST",
        data: {
            action: "store",
            username: username,
            storeData: JSON.stringify(storeData)
        },
        success: function(response) {
           console.log("Data stored successfully:", response);
        },
        error: function(error) {
            console.error("Error storing data:", error);
        }
    });
}

function retrieveUrlsFromServer() {
    $.ajax({
        url: "storageData.php",
        method: "POST",
        data: {
            action: "retrieve"
        },
        success: function(response) {
            let retrievedData = JSON.parse(response);
            console.log("Data retrieved successfully:", retrievedData);
        },
        error: function(error) {
            console.error("Error retrieving data:", error);
        }
    });
}


// // save every 3 seconds
setInterval(sendUrlsToServer, 3*1000);

//marked text
function addPointToMap(lat, lon,recordValue) {
    var marker =L.marker([lat, lon]).addTo(map);
    marker.setIcon(sourceicon)
    var originalSize = [40, 40]; 
    var enlargedSize = [60, 60]; 
    var dragonicon ="icon\\dragonicon.png";
    var treasureicon = "icon\\treasure.png"
    marker.isGrab = false
    marker.on('mouseover', function() {
        if(marker.isGrab == false){
            var icon = L.icon({
                iconUrl: dragonicon,
                iconSize: enlargedSize,
                iconAnchor: [22, 94],
            });
        }else{
            var icon = L.icon({
                iconUrl: treasureicon,
                iconSize: enlargedSize,
                iconAnchor: [22, 94],
            });
        }
        this.setIcon(icon)
    }).on('mouseout', function() {
        if(marker.isGrab == false){
            var icon = L.icon({
                iconUrl: dragonicon,
                iconSize: originalSize,
                iconAnchor: [22, 94],
            });
        }else{
            var icon = L.icon({
                iconUrl: treasureicon,
                iconSize: originalSize,
                iconAnchor: [22, 94],
            });
        }
        this.setIcon(icon);
    });
    
    var supportClick = false;
    markerArray.push(marker);
    //save data to marker
    marker.recordData =recordValue.URL;//url saved
    console.log("11111111111", marker.recordData);
    marker.marker=recordValue
    marker.image = recordValue['Primary image'];
    //Action listener
    marker.on("click",function(e){
        //click
        //ask if dig
        showConfirmationPopup(e.target,marker,function(result){
            supportClick = result;
            marker.isGrab = result;
            if(supportClick){
                playGifAndDelay();
                var self = this;
                setTimeout(function() {
                    
                    openModal.call(marker);
                    console.log("11111111111",this.recordData);
                    handleMarkerClick(self.recordData,self.image,marker);
                    //remove old action
                    $("#narration-container").off("click", showNextNarration);
                    // deal with new action
                    console.log("currentNarration",1);
                    $(`#narration-1`).addClass('hidden');
                    $(`#narration-${currentNarration}`).addClass('hidden');
                    $('#narration-container').show();
                    $("#dialoguebox").show();
                    $(`#congration-1`).removeClass('hidden');
                    $("#narration-container").on("click", congrateNarration);
                    marker.setIcon(customIcon);
                }, 4000); 
            }
        }.bind(this));             
    });
}


    function showConfirmationPopup(clickedMarker, marker,callback) {
            // remove old sidebar
    const oldSidebar = document.getElementById('sidebar');
    if (oldSidebar) {
        oldSidebar.parentNode.removeChild(oldSidebar);
    } 
        const sidebarHtml = document.createElement("div");
        sidebarHtml.id = "sidebar";
        sidebarHtml.classList.add('sidebar');
        var Date = marker.marker.Date;
        var caption = marker.marker['Title'];
        var place = marker.marker['Place'];
        var keywords = marker.marker['Keywords'];
        var images = marker.marker['Primary image'];
        console.log(place);
        sidebarHtml.innerHTML = `
            <img src="icon\\dragon2.png" alt="No picture" width="250">
            <p>Memory:${caption}<p>
            <button id="closeIcon"  style="position: absolute; top: 10px; right: 10px;">X</button>
            <p>Locaion: ${place}<br>Date: ${Date}<br>keywords: ${keywords}<br></p>
            <button id="startDig">Dig</button>
            <button id="closeSidebar">Cancel</button>
        `;
        // add new sidebar to body
        document.getElementById("map").appendChild(sidebarHtml);
        
        const audio = document.getElementById("sidebarAudio");
        // play audio
        audio.play();
    
        document.getElementById("startDig").addEventListener('click', function() {
            if (typeof callback === "function") {
                callback(true);
            }
            clickedMarker.closePopup();
            clickedMarker.unbindPopup();
            //stop audio and reset
            audio.pause();
            audio.currentTime = 0;
        });
    
        document.getElementById('closeSidebar').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            document.getElementById("map").removeChild(sidebar);
            audio.pause();
            audio.currentTime = 0;
        });

            // add close function to button
        document.getElementById('closeIcon').addEventListener('click', function () {
            const sidebar = document.getElementById('sidebar');
            document.getElementById("map").removeChild(sidebar);
            audio.pause();
            audio.currentTime = 0;
        });

    } 

// play gif and wait for 3 seconds
function playGifAndDelay() {
    var gifElement = document.getElementById('defeat-gif');
    if (gifElement) {
        // show gif
        gifElement.style.display = 'block';
        setTimeout(function() {
            gifElement.style.display = 'none';
        }, 3000); 
    }
}

//close sidebar
function closeConfirmationSidebar() {
    document.getElementById('confirmationSidebar').classList.add('hidden');
}

function iterateRecords(data) {
    $.each(data.result.records, function(recordKey, recordValue) {
        const brisbaneSuburbs = [
            "Brisbane","Brisbane-City","South Brisbane", "West End","Fortitude Valley",
            "Woolloongabba","Indooroopilly","Toowong","Chermside","Fairfield", "Milton",
            "South Bank","Wynnum", "Lytton","Albion","Bowen Hills","Herston", "New Farm",
            "Taringa", "Annerley", "Ashgrove","Bardon", "Bulimba", "Kangaroo Point",
            "Kelvin Grove", "Mount Gravatt"
        ];
        if(brisbaneSuburbs.includes(recordValue.Place)){
            var latitude = recordValue.Latitude +(Math.random() * 0.2 - 0.1)
            var Longitude = recordValue.Longitude + (Math.random() * 0.2 - 0.1)
            if(latitude && Longitude){
                
                addPointToMap(latitude,Longitude,recordValue)
            }
        }
    }
    )
}

$(document).ready(function() {
    var data = {
        resource_id: "d73f2a2a-c271-4edd-ac45-25fd7ad2241f",
        limit: 8500,
    }
//enter coordinates
    $.ajax({
        url: "https://data.gov.au/data/api/3/action/datastore_search", 
        data: data,
        dataType: "jsonp", 
        cache: true,
        success: function(data) {
            console.log(data)
            iterateRecords(data);
        }   
    });      
});

//open the window
document.addEventListener("DOMContentLoaded",function(){
});

//button to show creent location
function showCurrent(){
    if (navigator.geolocation){
        
        navigator.geolocation.getCurrentPosition(function (position){
            var pos = L.latLng(position.coords.latitude,position.coords.longitude);
            L.marker([position.coords.latitude, position.coords.longitude],{icon:userIcon}).addTo(map);
            //get location and enlarge map
            map.setView(pos,13);
            //make far points invisible
            markerArray.forEach(function(marker){
                var distance= pos.distanceTo(marker.getLatLng());
                if (distance <= 10*200){
                    marker.setOpacity(1);
                }else if (distance <= 10*400) {
                    marker.setOpacity(0.5);
                }else{
                    marker.setOpacity(0);
                }
            })

        });
    }else{
        alert("Where are you?");
    }
}

//treasure icon
var customIcon = L.icon({
    iconUrl: 'icon\\treasure.png',   
    iconSize: [50, 50],       
    iconAnchor: [22, 94],     
    popupAnchor: [-3, -76]    
});

//user icon
var userIcon = L.icon({
    iconUrl: 'icon\\user.png',
    iconSize: [60, 60],       
    iconAnchor: [22, 94],     
})
//dragon icon
var sourceicon = L.icon({
    iconUrl:  'icon\\dragonicon.png',  
    iconSize: [60, 50], 
    iconAnchor: [22, 94], 
    popupAnchor: [-3, -76] 
});



function showNextNarration() {
    // hide the dialogues
    $(`#narration-${currentNarration}`).addClass('hidden');
    currentNarration++;

    // if still have dialogues to exist
    if (currentNarration <= 5) {
        $(`#narration-${currentNarration}`).removeClass('hidden');
    } else {
        // hade dialogues while finish
        $('#narration-container button').hide();
    }

}

function congrateNarration() {
    console.log("really get it");
    $('#narration-container button').show();
    // hide current dialogues
    $(`#narration-${currentNarration}`).addClass('hidden');
    // hide former dialogues
    $(`#congration-${currentCongration}`).addClass('hidden');
    currentCongration++;
    
    if (currentCongration <= 4) {
        console.log("congrateNarration",currentCongration)
        // if still have dialogues
        $(`#congration-${currentCongration}`).removeClass('hidden');
    } else {
        // after all finish , hide the button
        $('#narration-container button').hide();
        currentCongration=0;
    }
}
function fetchUsername() {
    $.ajax({
        url: 'username.php',
        type: 'GET',
        dataType: 'text',
        success: function(data) {
            if (data && data.includes("Login first!")) {
                alert('log in first!');
            } else {
                // you don't apply the user_name
                console.log("The user already loged in");
            }
        },
        error: function() {
            // failed
            alert('Please try again later.');
        }
    });
}

