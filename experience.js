// Global variable markerArray
var grabbed = []
var grabbedMarkersCount = 0;
// Player
let playerLevel = 1;
const EXPERIENCE_TO_LEVEL_UP = 3; // Level up every 3 experience points

// When the page is fully loaded
$(document).ready(function() {
    console.log("Document is ready!");
    // Migrated from basic.js
    let cards = document.querySelectorAll('.container .card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            card.classList.remove('locked');
            card.classList.add('unlocked');
        });
    });

    // Use AJAX to fetch grabbed URLs from mvp.php
    $.ajax({
        url: 'storageData.php?action=fetch_urls',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log("Fetched URLs successfully!"); 
            grabbed = data;
            console.log(data);
            data.forEach(function(marker){
                console.log("Iterating through " + marker.grabbedMarkersCount + " url " + marker.url);
                
                displayRecordData(marker.image, marker.title, marker.url);
                addEmptyCard();
                grabbedMarkersCount = marker.grabbedMarkersCount;
                updateHealthBar(grabbedMarkersCount);
            });
        },
        error: function(error) {
            console.error("Error fetching URLs:", error);
        }
    });
});

function displayRecordData(image, title, url) {
    // 1. Find the first blank card
    let emptyCard = document.querySelector(".big-container .container.empty");
    if (!emptyCard) {
        console.error("No empty card found!");
        return;
    }

    // 2. Fill data into this blank card
    let imgBox = emptyCard.querySelector(".imgBx img");
    let contentBox = emptyCard.querySelector(".content");
    if (imgBox && contentBox) {
        imgBox.src = image;

        // Create hyperlink part
        let newLink = document.createElement("a");
        newLink.href = url;  // Set the target of the hyperlink
        newLink.textContent = title;  // Use the provided textContent as the link text
        contentBox.appendChild(newLink);

        // Display this card
        emptyCard.style.display = 'flex';  // Set the card to be displayed
        console.log(emptyCard.style.display + " Setting the card to be displayed");

        // Remove the 'empty' class as this card is no longer empty
        emptyCard.classList.remove('empty');
    }
}

// Create a new blank card
function addEmptyCard() {
    // Get the main container
    let bigContain = document.querySelector(".big-container");

    // Create a new container
    let newContainer = document.createElement('div');
    newContainer.className = 'container empty';
    newContainer.style.display = 'none';
    console.log("不可见"+ newContainer.style.display);

    // Create card element
    let card = document.createElement('div');
    card.className = 'card';

    // Create imgBx and its child img element
    let imgBx = document.createElement('div');
    imgBx.className = 'imgBx';
    let img = document.createElement('img');
    img.src = "icon/locked.png";
    img.alt = "";
    imgBx.appendChild(img);
    card.appendChild(imgBx);

    // Create content and its children h2 and p elements
    let content = document.createElement('div');
    content.className = 'content';
    let h2 = document.createElement('h2');
    let p = document.createElement('p');
    content.appendChild(h2);
    content.appendChild(p);
    card.appendChild(content);

    // Append card to newContainer
    newContainer.appendChild(card);

    // Append the new container to the main container
    bigContain.appendChild(newContainer);

    // Re-bind the click event
    let newCard = newContainer.querySelector('.card');
    newCard.addEventListener('click', function() {
        newCard.classList.remove('locked');
        newCard.classList.add('unlocked');
    });
}

// Update health bar
function updateHealthBar(){
    let experiencePercentage = (grabbedMarkersCount / EXPERIENCE_TO_LEVEL_UP) * 100;

    // Update the width of the experience bar
    document.querySelector('.progress').style.width = experiencePercentage + '%';

    // Check if it's time to level up
    if (grabbedMarkersCount >= EXPERIENCE_TO_LEVEL_UP) {
        playerLevel++;
        grabbedMarkersCount = 0;
        document.querySelector('.level').textContent = 'Level ' + playerLevel;
        document.querySelector('.progress').style.width = '0%'; // Reset experience bar
    }
};
