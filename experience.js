var records= [];
var all_data =[];

//先从js里找到所有brisbane的，把他们列出来，然后排列，然后解锁，然后干

function updateHealthBar(){
    var grabbedMarkersCount=records.length;   
    let experiencePercentage = (grabbedMarkersCount / 3) * 100;

    // 更新经验条的宽度
    document.querySelector('.progress').style.width = experiencePercentage + '%';

    // 判断是否升级
    if (grabbedMarkersCount >= 3) {
        playerLevel++;
        grabbedMarkersCount = 0;
        document.querySelector('.level').textContent = 'Level' + playerLevel;
        document.querySelector('.progress').style.width = '0%'; // 经验条归零
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

//输入坐标增加标记
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
        // 使用AJAX从mvp.php获取grabbed URLs
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
            console.log("这里进来了吗");
            insertDataToDivs(firstAjaxResponse[0]);
            var records = secondAjaxResponse[0];
            displayDivsByIds(records);
            });

            
 });      


function createDivsForSuburbs() {
    const container = $('#all-data');
    brisbaneSuburbs.forEach(suburb => {
        const suburbId = suburb.replace(/\s+/g, '-').toLowerCase(); // 创建 suburb 的唯一 ID
        const $suburbDiv = $('<div></div>', {
            id: suburbId,
            class: 'suburb-div'
        });
        const $suburbSection = $('<section></section>', {
            class: 'tiles'
        });

        $suburbDiv.append(`<h3>${suburb}</h3>`);
        $suburbDiv.append($suburbSection); // 将 section 添加到 suburb div
        container.append($suburbDiv);
    });
}
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

function addArticleToSection($section, imageUrl, record) {
    const articleId = convertUrlToId(record.URL); 
    const $newArticle = $('<article></article>', {
        class: 'style1',
        id: articleId, // 为文章设置ID
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
    $section.append($newArticle); // 将 article 添加到对应 suburb 的 section
}
    
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
function applyStatusFilter() {
    const filterValue = $("#statusFilter").val();
    switch (filterValue) {
        case "all":
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
            $(".record-div").show();  // 默认显示所有div
            break;
    }
}

function applyRegionFilter() {
    const regionValue = $("#regionFilter").val().toLowerCase();
    if (regionValue) {
        $(".suburb-div").each(function() {
            const suburbName = $(this).attr('id'); // 使用div的id来获取suburb名字
            if (suburbName.includes(regionValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    } else {
        $(".suburb-div").show();  // 如果输入框为空，则显示所有div
    }
}
function displayUnlocked(lockedIds, allIds) {
    allIds.forEach(function(id) {
        const convertedId = convertUrlToId(id);

        if (lockedIds.includes(id)) {
            // 如果id在lockedIds中，将其隐藏
            $("#" + convertedId).hide();
        } else {
            // 如果id不在lockedIds中，将其显示
            $("#" + convertedId).show();
        }
    });
}

//显示我已经成功解锁的
function displayDivsByIds(idsArray) {
    // 首先隐藏所有的项
    $(".style1").hide(); 

    // 遍历idsArray，显示对应的项
    idsArray.forEach(function(id) {
        const convertedId = convertUrlToId(id);
        $("#" + convertedId).show();
    });
}

// //去掉特殊符号
function convertUrlToId(url) {
    return url.replace(/[^a-zA-Z0-9]/g, "_");
}

$(document).ready(function() {
    // 监听勾选框的变化
    $("#statusFilter").change(applyStatusFilter);

    // 监听搜索按钮点击
    $("#searchRegion").click(applyRegionFilter);
});
