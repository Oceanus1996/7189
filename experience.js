
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
var records= [];
var all_data =[];
const brisbaneSuburbs = [
    "Brisbane","Brisbane-City","South Brisbane", "West End","Fortitude Valley","Woolloongabba","Indooroopilly",
    ,"Toowong","Chermside","Fairfield", "Milton","South Bank", "Wynnum", "Lytton",
    "Albion","Bowen Hills"
];
// function iterateRecords(data) {
//     $.each(data.result.records, function(recordKey, recordValue) {
       
//         if(brisbaneSuburbs.includes(recordValue.Place)){
//             records.push({
//                 place: recordValue.Place,
//                 latitude: recordValue.latitude,
//                 longitude: recordValue.longitude
//             });
//         }
        
//     }
// )
// }

$(document).ready(function() {

    var data = {
        resource_id: "d73f2a2a-c271-4edd-ac45-25fd7ad2241f", // to change to a different dataset, change the resource_id
        limit: 8500,
    }
    createDivsForSuburbs();

//输入坐标增加标记
$.when(
    $.ajax({
        url: "https://data.gov.au/data/api/3/action/datastore_search", // if the dataset is coming from a different data portal, change the url (i.e. data.gov.au)
        data: data,
        dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise XSS).
        cache: true,
        success: function(data) {
            // iterateRecords(data);
            insertDataToDivs(data);
        }
    }),
        // 使用AJAX从mvp.php获取grabbed URLs
        $.ajax({
            url: 'storageData.php',
            method: 'POST',
            data: { action: 'fetch_urls' },
            dataType: 'json',
            success: function(data) {
                records=data;
                console.log("你成功了吗",records);
                console.log("Fetched URLs successfully!"); 
                grabbed = data;
                console.log(data);
                displayDivsByIds(records);
                
            },
            error: function(error) {
                console.error("Error fetching URLs:", error);
            }
        })
        ).done(function(firstAjaxResponse, secondAjaxResponse) {
            insertDataToDivs(firstAjaxResponse[0]);
    
        var records = secondAjaxResponse[0];
        displayDivsByIds(records);
            });
            
 });      

  

function createDivsForSuburbs() {
    const container = $('#all-data');
    brisbaneSuburbs.forEach(suburb => {
        const $suburbDiv = $('<div></div>', {
            id: suburb.replace(/\s+/g, '-').toLowerCase(), // 为每个div创建一个唯一ID，例如"brisbane-city"
            class: 'suburb-div',
            
        });

        $suburbDiv.append(`<h3>${suburb}</h3>`); // 为每个地点添加一个标题
        container.append($suburbDiv);
    });
}


    //插入子div
    function insertDataToDivs(data) {
        
        data.result.records.forEach(function(record) {
            // 创建一个新的div
            var urlId=convertUrlToId(record['URL']);
            if (brisbaneSuburbs.includes(record.Place)) {
                const $newDiv = $('<div></div>', {
                    class: 'record-div',
                    id: urlId,
                });
                var place = record.Place.replace(/\s+/g, '-').toLowerCase();
                all_data.push(urlId);
                // 将数据插入新div中。这里是一个简单的示例，您可能需要根据具体的数据结构进行修改。
                $newDiv.html(`
                    <p>Place: ${record.Place}</p>
                    <p>Latitude: ${record.Latitude}</p>
                    <p>Longitude: ${record.Longitude}</p>
                    <p>Caption: ${record['Title']}</p>
                    <p>Caption: ${record['Place']}</p>
                
                `);
                $newDiv.css({
                    "background-image": `url(${record['Primary image']})`,
                    "background-size": "cover",
                    "background-repeat": "no-repeat" ,
                    "display":"none",
                });
                
                // 将新div添加到主容器中
                $("#" + place).append($newDiv);
            }
            
        });
    }
  
    //显示我已经成功解锁的
    function displayDivsByIds(idsArray) {
        idsArray.forEach(function(divId) {
            console.log("成功运作了吗",divId,convertUrlToId(divId));
            $("#" + convertUrlToId(divId)).css('display', 'block');
        });
    }
    //解锁unlock
    function displayUnlocked(idsArray, allARRAY) {
        allARRAY.forEach(function(divId) {
            var convertedId = convertUrlToId(divId);
    
            if(idsArray.includes(divId)) {
                // 如果divId在idsArray中，将其隐藏
                $("#" + convertedId).css('display', 'none');
            } else {
                // 如果divId不在idsArray中但在allARRAY中，将其显示
                $("#" + convertedId).css('display', 'block');
                console.log("成功运作了吗", divId, convertedId);
            }
        });
    }
    
//去掉特殊符号
function convertUrlToId(url) {
    return url.replace(/[^a-zA-Z0-9]/g, "_");
}

function applyStatusFilter() {
    var filterValue = $("#statusFilter").val();
    if (filterValue == "all") {
        $(".record-div").show();  // 显示所有div
    } else if (filterValue == "unlocked") {
        $(".record-div").hide();  // 首先隐藏所有div
        displayDivsByIds(records); 
    } else if (filterValue == "locked") {
        $(".record-div").hide();  // 首先隐藏所有div
        displayUnlocked(records,all_data);
    }
}
function applyRegionFilter() {
    var regionValue = $("#regionFilter").val().toLowerCase();

    if (regionValue) {
        $(".suburb-div").each(function() {
            var divPlaceName = $(this).find('p').first().text().split(': ')[1].toLowerCase();

            if (divPlaceName.includes(regionValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    } else {
        $(".suburb-div").show();  // 如果输入框为空，则显示所有div
    }
}


$(document).ready(function() {
    // 监听勾选框的变化
    $("#statusFilter").change(applyStatusFilter);

    // 监听搜索按钮点击
    $("#searchRegion").click(applyRegionFilter);
});
