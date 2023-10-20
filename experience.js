// //全局变量markerArray
// var grabbed=[]
// var grabbedMarkersCount=0;
// // 玩家
// let playerLevel = 1;
// const EXPERIENCE_TO_LEVEL_UP = 3; // 每3经验点升级

// //页面加载完成后
// $(document).ready(function() {
//     console.log("Document is ready!");
//     //从basic.js移植
//     let cards = document.querySelectorAll('.container .card');
//     cards.forEach(card => {
//         card.addEventListener('click', function() {
//         card.classList.remove('locked');
//             card.classList.add('unlocked');
//         });
//     });


    // 使用AJAX从mvp.php获取grabbed URLs
    $.ajax({
        url: 'storageData.php?action=fetch_urls',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log("Fetched URLs successfully!"); 
            grabbed = data;
            console.log(data);
            data.forEach(function(marker){
                console.log("遍历打印"+marker.grabbedMarkersCount+"url"+marker.url);
                
                displayRecordData(marker.image, marker.title,marker.url);
                addEmptyCard();
                grabbedMarkersCount=marker.grabbedMarkersCount;
                updateHealthBar(grabbedMarkersCount);
            });
        },
        error: function(error) {
            console.error("Error fetching URLs:", error);
        }
    });

    
    
// });
// function displayRecordData( image, title,url) {
//     // 1. 找到第一个空白的卡片
//     let emptyCard = document.querySelector(".big-container .container.empty");
//     if (!emptyCard) {
//         console.error("No empty card found!");
//         return;
//     }

//     // 2. 填充数据到这个空白的卡片
//     let imgBox = emptyCard.querySelector(".imgBx img");
//     let contentBox = emptyCard.querySelector(".content");
//     if (imgBox && contentBox) {
//         imgBox.src = image;

//         // let titleElem = contentBox.querySelector("h2");
//         // let textElem = contentBox.querySelector("p");
        
//     // 创建超链接部分
//     let newLink = document.createElement("a");
//     newLink.href = url;  // 设置超链接的目标
//     newLink.textContent = title;  // flex使用传入的textContent参数作为链接文本
//     contentBox.appendChild(newLink);
//          // 显示这个卡片
//          emptyCard.style.display = 'flex';  // 这里将卡片设置为显示状态
//          console.log(emptyCard.style.display+"这里将卡片设置为显示状态" );

//     // Remove the 'empty' class as this card is no longer empty
//     emptyCard.classList.remove('empty');
//     }
// }

// //创建新的空白卡片
// function addEmptyCard() {
//     // 获取大的容器
//     console.log("测试真的家没有");
//     let bigContain = document.querySelector(".big-container");
//     console.log("bigContain"+bigContain);

//     // 创建一个新的container
//     let newContainer = document.createElement('div');
//     newContainer.className = 'container empty';
//     // newContainer.style.display = 'none';  // 默认设置为隐藏

//     // 创建card元素
//     let card = document.createElement('div');
//     card.className = 'card';

//     // 创建imgBx元素并其中的img元素
//     let imgBx = document.createElement('div');
//     imgBx.className = 'imgBx';
//     let img = document.createElement('img');
//     img.src = "icon/locked.png";
//     img.alt = "";
//     imgBx.appendChild(img);
//     card.appendChild(imgBx);

//     // 创建content元素并其中的h2和p元素
//     let content = document.createElement('div');
//     content.className = 'content';
//     let h2 = document.createElement('h2');
//     let p = document.createElement('p');
//     content.appendChild(h2);
//     content.appendChild(p);
//     card.appendChild(content);

//     // 将card元素添加到newContainer中
//     newContainer.appendChild(card);

//     // 将新创建的容器添加到大容器中
//     bigContain.appendChild(newContainer);
//     console.log("测试真的家没有"+newContainer);
//      // 重新绑定点击事件
//     let newCard = newContainer.querySelector('.card');
//     newCard.addEventListener('click', function() {
//         newCard.classList.remove('locked');
//         newCard.classList.add('unlocked');
//     });
      
// }

// //update 血条
// function updateHealthBar(){
//     let experiencePercentage = (grabbedMarkersCount / EXPERIENCE_TO_LEVEL_UP) * 100;

//     // 更新经验条的宽度
//     document.querySelector('.progress').style.width = experiencePercentage + '%';

//     // 判断是否升级
//     if (grabbedMarkersCount >= EXPERIENCE_TO_LEVEL_UP) {
//         playerLevel++;
//         grabbedMarkersCount = 0;
//         document.querySelector('.level').textContent = 'Level' + playerLevel;
//         document.querySelector('.progress').style.width = '0%'; // 经验条归零
//     }
    
// };


//先从js里找到所有brisbane的，把他们列出来，然后排列，然后解锁，然后干
const records= [];
const brisbaneSuburbs = [
    "Brisbane","Brisbane-City","South Brisbane", "West End","Fortitude Valley","Woolloongabba","Indooroopilly",
    ,"Toowong","Chermside","Fairfield", "Milton","South Bank", "Wynnum", "Lytton",
    "Albion","Bowen Hills"
];
function iterateRecords(data) {
    $.each(data.result.records, function(recordKey, recordValue) {
       
        if(brisbaneSuburbs.includes(recordValue.Place)){
            records.push({
                place: recordValue.Place,
                latitude: recordValue.latitude,
                longitude: recordValue.longitude
            });
        }
        
    }
)
}

$(document).ready(function() {

    var data = {
        resource_id: "d73f2a2a-c271-4edd-ac45-25fd7ad2241f", // to change to a different dataset, change the resource_id
        limit: 8500,
    }
    createDivsForSuburbs();

//输入坐标增加标记
    $.ajax({
        url: "https://data.gov.au/data/api/3/action/datastore_search", // if the dataset is coming from a different data portal, change the url (i.e. data.gov.au)
        data: data,
        dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise XSS).
        cache: true,
        success: function(data) {
            console.log(data)
            iterateRecords(data);
            insertDataToDivs(data); 
        }
    }); 
    $.ajax({
        url: 'storageData.php?action=fetch_urls',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log("Fetched URLs successfully!"); 
            grabbed = data;
            console.log(data);
            data.forEach(function(marker){
                console.log("遍历打印"+marker.grabbedMarkersCount+"url"+marker.url);
                // displayRecordData(marker.image, marker.title,marker.url);
                // addEmptyCard();
                // grabbedMarkersCount=marker.grabbedMarkersCount;
                updateHealthBar(grabbedMarkersCount);
            });
        },
        error: function(error) {
            console.error("Error fetching URLs:", error);
        }
    });     
});    

function createDivsForSuburbs() {
    const container = $('#all-data');
    brisbaneSuburbs.forEach(suburb => {
        const $suburbDiv = $('<div></div>', {
            id: suburb.replace(/\s+/g, '-').toLowerCase(), // 为每个div创建一个唯一ID，例如"brisbane-city"
            class: 'suburb-div', // 可选的，如果您想为这些div应用一些样式
        });
        const  $EmptyDiv1 =  $('<div></div>', {
            class: 'record-div', // 可选的，如果您想为这些div应用一些样式
        });
        const  $EmptyDiv2 =  $('<div></div>', {
            class: 'record-div', // 可选的，如果您想为这些div应用一些样式
        });

        $suburbDiv.append(`<h3>${suburb}</h3>`); // 为每个地点添加一个标题
        // $suburbDiv.append( $EmptyDiv1);
        // $suburbDiv.append( $EmptyDiv2);
        container.append($suburbDiv);
        
        
    });
}


    //插入子div
    function insertDataToDivs(data) {
        
        data.result.records.forEach(function(record) {
            // 创建一个新的div
            if (brisbaneSuburbs.includes(record.Place)) {
                const $newDiv = $('<div></div>', {
                    class: 'record-div',
                    onclick: `window.location.href='${record.Url}';`
                });
                $newDiv.css('background-image', `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${record['Primary image']})`);
                var place = record.Place.replace(/\s+/g, '-').toLowerCase();

                // 将数据插入新div中。这里是一个简单的示例，您可能需要根据具体的数据结构进行修改。
                $newDiv.html(`
                    <p>Place: ${record.Place}</p>
                    <p>Location: ${record.Latitude},${record.Longitude}</p>
                    <p>${record.Title}</p>
                `);
    
                // 将新div添加到主容器中
                $("#" + place).append($newDiv);
            }
            
        });
    }

