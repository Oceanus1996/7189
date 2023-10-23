# 
1 Project introduction

1.1 Project Name and Background
The name of the game is called Brisbane Dragon Odyssey, the story of the game takes place in the beautiful city of Brisbane, one day, dragons suddenly descended and sealed the city, the dragons’ flames ignited the city and even the sea water, and the people in the city were plunged into chaos and pain. The player, as the summoned warrior, digs the treasure of the evil dragons, defeats the dragons, weakens the seal, and finally rescues the city.

1.2 Project Objectives
Whenever players reach a new location in the game, they have the opportunity to click on objectives that unveils news articles related to that place. This feature not only updates players with the most recent information about Brisbane but also delves into the city's rich tapestry of culture, history, current events, and societal nuances. By allowing players to click on these locations and uncover the news stories behind them, the typically mundane task of reading is transformed into an engaging and exciting adventure.
The primary objective of the game isn't just to conquer the dragon and safeguard the city, but also to instill in players a newfound appreciation for news reading and to immerse them in the diverse corners of Brisbane. This allows them to truly experience the city's vibrant pulse and allure. Furthermore, players have the ability to interact with one another, share the news articles and stories they uncover, and collectively relish in the colorful experiences Brisbane has to offer.

1.4 Functions
(1) Registration and login function: It can record the websites that the user has read before.
(2) Character creation function: each time before the player enters the game, he/she can freely choose and create a character.
(3) Location function: Players can click the "current location" button to locate their current location.
(4) Digging function: Players can click on the dragon icon to display the sidebar, and click on the "dig" button on the sidebar to dig.
(5) News: After digging, a pop-up window will appear with news content.

2.API
API Documentation Overview Our API provides the following key functionalities:
1、Fetch specific news content from the abclocal website.
2、Interact with the data.gov.au public dataset API to retrieve news story 3、data. Please note that our API utilizes the open-source library 
4、simple html dom for parsing HTML content.
Authentication and Access Our API does not require authentication and can be accessed publicly.
AGet News Content
URL: /api/get-news-content
Method: POST
Description: This endpoint is used to fetch specific news content from the abclocal website.
Request Parameters:
urlToFetch (required): The URL of the specific news article to fetch.
Request Example:PI Endpoints
$.ajax({
    url: "/api/get-news-content",
    method: "POST",
    data: {
        urlToFetch: "https://example.com/news-article"
    },success: function(response) {// success
    }, error: function(error) { // error；});
Successful Response:
If the request is successful, the API will return a JSON response containing the following information:
title: The title of the news article.
textContent: The textual content of the news article.
image: The URL of the news article's image.
Error Response:
If the request fails, the API will return an appropriate error message.
Get News Story Data

2、URL:https://data.gov.au/data/api/3/action/datastore_search
Method: GET
Description: This endpoint is used to interact with the data.gov.au public dataset API and retrieve news story data.
Request Example:
$.ajax({
    url: "/api/get-news-stories",
    method: "GET",
    success: function(response) {
        // success  },
    error: function(error) {// error }
});
Successful Response:
If the request is successful, the API will return news story data matching the data.gov.au dataset.
Error Response:
If the request fails, the API will return an appropriate error message.

3. Example of use
Step 1: Login/Register function. After the animation explaining the background of the game, the player first enters the login page, and players who already have an account can directly enter their account number and password to log in, while new players who do not yet have an account or those who want to re-create an account can click on "Register" at the bottom right of the input box to jump to the registration page.
Step 2: Create a character: Players can choose a male or female character image.
Step 3: Get the player's geographic location: After entering the "Adventure" page, the player first clicks on "current location" to get the player's current location.
Step 4: Defeat the dragons around the player: Click on the white dragon icon on the map to dig and defeat the dragons.
Step 5: Read the news: After defeating the dragon, the news will pop up on the page and the player will read the news.
Step 6: Browse history: Players can go to the "experience" page to review the news they have read, and can see the location information with unlocked news.

4 Authors and Contributors
4.1 Project Authors
The following are the main authors of this project:
Ruomai Ren (ID: 47652749) - Project lead responsible for design and development.
Qihong Yang (ID: 47735624) - Contributed significant code and feature development.
Xufeng Zhang (ID: 47006605) - Involved in project design and documentation.
4.2 Contributors
The following individual made contributions to the project:
Summer- (Tutor) - Provided important design recommendations.
4.3 Acknowledgments
We would like to extend our special thanks to the following individuals and groups as their support and feedback have been crucial to the success of this project:
Ms. Susan Beetson - Course Coordinator / Lecturer
Miss Alina Rakhi Ajayan - Tutor
Ms. Summer Yang - Tutor
Mr. Akbar Putra Novial - Tutor
Mrs. Julia Drugova - Tutor

5 Contact Us:
Telephone: +61 478 456 181
Email: info@BrisbaneDragonOdyssey.com
Instagram: @BrisbaneDragonOdyssey
Facebook: @BrisbaneDragonOdyssey
Twitter: @BrisbaneDragonOdyssey
Location: 99 Tank Street, Brisbane City, QLD, Australia, 4000
