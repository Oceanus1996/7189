var records= [];
var all_data =[];
let playerLevel = 1;

//update the experience bar
function updateHealthBar(){
    var grabbedMarkersCount = records.length % 3;   
    let experiencePercentage = (grabbedMarkersCount / 3) * 100;

    //update the width of experience bar
    document.querySelector('.progress').style.width = experiencePercentage + '%';

    console.log(`Records Length: ${records.length}`);
    console.log(`Player Level: ${playerLevel}`);
    console.log(`Experience Percentage: ${experiencePercentage}%`);

    // check if level up
    if (records.length > 0 && records.length % 3 === 0) {
        playerLevel++;
        console.log("Player has leveled up!");
        document.querySelector('.level').textContent = 'Level ' + playerLevel;
        document.querySelector('.progress').style.width = '0%';
    }   
    
};
const brisbaneSuburbs = [
    "Brisbane","Brisbane-City","South Brisbane", "West End","Fortitude Valley","Woolloongabba","Indooroopilly",
    ,"Toowong","Chermside","Fairfield", "Milton","South Bank", "Wynnum", "Lytton",
    "Albion","Bowen Hills"
];

$(document).ready(function() {

    var data = {
        resource_id: "d73f2a2a-c271-4edd-ac45-25fd7ad2241f", // to change to a different dataset, change the resource_id
        limit: 8500,
    }
    createDivsForSuburbs();

//Enter coordinates to add a marker
$.when(
    $.ajax({
        url: "https://data.gov.au/data/api/3/action/datastore_search", // if the dataset is coming from a different data portal, change the url (i.e. data.gov.au)
        data: data,
        dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise XSS).
        cache: true,
        success: function(data) {;
            insertDataToDivs(data);
        }
    }),
        // use AJAX from mvp.php to get grabbed URLs
        $.ajax({
            url: 'storageData.php',
            method: 'POST',
            data: { action: 'fetch_urls' },
            dataType: 'json',
            success: function(data) {
                records=data;
                console.log("Fetched URLs successfully!"); 
                grabbed = data;
                updateHealthBar();
                displayDivsByIds(records);
            },
            error: function(error) {
                console.error("Error fetching URLs:", error);
            }
        })
        ).always(function(firstAjaxResponse, secondAjaxResponse) {
            console.log("is it in");
            insertDataToDivs(firstAjaxResponse[0]);
            var records = secondAjaxResponse[0];
            displayDivsByIds(records);
            });

            
 });      


//  create divs for all places
function createDivsForSuburbs() {
    const container = $('#all-data');
    brisbaneSuburbs.forEach(suburb => {
        const suburbId = suburb.replace(/\s+/g, '-').toLowerCase(); // create unique ID of suburb
        const $suburbDiv = $('<div></div>', {
            id: suburbId,
            class: 'suburb-div'
        });
        const $suburbSection = $('<section></section>', {
            class: 'tiles'
        });

        $suburbDiv.append(`<h3>${suburb}</h3>`);
        $suburbDiv.append($suburbSection); // put section into suburb div
        container.append($suburbDiv);
    });
}

//create every block to show news
function insertDataToDivs(data) {
    data.result.records.forEach(function(record) {
    var urlId=convertUrlToId(record['URL']);
        if (brisbaneSuburbs.includes(record.Place)&&!all_data.includes(urlId)) {
            const suburbId = record.Place.replace(/\s+/g, '-').toLowerCase();
            const $suburbSection = $("#" + suburbId + " .tiles");
            all_data.push(urlId);
            let imageUrl = record['Primary image'];
            
            checkImgExists(imageUrl).then(() => {

                addArticleToSection($suburbSection, imageUrl, record);
            }).catch(() => {

                imageUrl = "icon\\ceshi.png";
                addArticleToSection($suburbSection, imageUrl, record);
            });
        }
    });
}  

//create details for place blocks
function addArticleToSection($section, imageUrl, record) {
    const articleId = convertUrlToId(record.URL); 
    const $newArticle = $('<article></article>', {
        class: 'style1',
        id: articleId, // set ID toarticles
    }).append(
        $('<span></span>', {
            class: 'image', 
        }).append(
            $('<img>', {
                src: imageUrl,
                alt: '',
            })
        ),
        $('<a></a>', {
            href: record.URL
        }).append(
            $('<h2></h2>').text(record['Title']),
            $('<div></div>', {
                class: 'content'
            }).append(
                $('<p></p>').text("Longitude:" + record.Longitude + ', ' + "Latitude:" + record.Latitude)
            )
        )
    );
    $section.append($newArticle); // add article into the session of suburb 
}

//error for image whether exists
function checkImgExists(imgUrl){
    return new Promise(function(resolve, reject){
        var ImgObj = new Image();
        ImgObj.src = imgUrl;
        ImgObj.onload = function(res){
            resolve(res);
        };
        ImgObj.onerror = function(err){
            reject(err);
        };
    })
}

//filter function
function applyStatusFilter() {
    const filterValue = $("#statusFilter").val();

    
    switch (filterValue) {
        case "all":
            $(".style1").show();
            $(".record-div").show();
            break;
        case "unlocked":
            $(".record-div").hide();
            displayDivsByIds(records);
            break;
        case "locked":
            $(".record-div").hide();

            displayUnlocked(records, all_data);
            break;
        default:
            $(".record-div").show();  // show all div
            break;
    }
}

//region filter
function applyRegionFilter() {
    const regionValue = $("#regionFilter").val().toLowerCase();
    if (regionValue) {
        $(".suburb-div").each(function() {
            const suburbName = $(this).attr('id'); // use id to get suburbs' name
            if (suburbName.includes(regionValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    } else {
        $(".suburb-div").show();  // if nothing input, show all div
    }
}

//unlocked region show
function displayUnlocked(lockedIds, allIds) {
    allIds.forEach(function(id) {
        const convertedId = convertUrlToId(id);

        if (lockedIds.includes(id)) {
            // hide it if the id is in lockedIDs
            $("#" + convertedId).hide();
        } else {
            // if not, show it
            $("#" + convertedId).show();
        }
    });
}

//show unlocked div
function displayDivsByIds(idsArray) {
    // hide all div
    $(".style1").hide(); 
    

    // Iterate through idsArray and display the corresponding items.
    idsArray.forEach(function(id) {
        const convertedId = convertUrlToId(id);
        $("#" + convertedId).show();
    });
}

//Remove special characters
function convertUrlToId(url) {
    return url.replace(/[^a-zA-Z0-9]/g, "_");
}

$(document).ready(function() {
    // Listen for changes to the checkboxes
    $("#statusFilter").change(applyStatusFilter);

    // Listen for search button clicks
    $("#searchRegion").click(applyRegionFilter);
});


//popup introduction
function openPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}