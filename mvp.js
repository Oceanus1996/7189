// 初始化地图
var map = L.map('map').setView([-3.56518,143.619995], 5); // 使用Wewak, New Guinea作为初始中心

L.tileLayer('https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=b6bf392431654cfd9009af454cf8e333', {
    attribution: '&copy; Thunderforest, &copy; OpenStreetMap Contributors',
    maxZoom: 22
}).addTo(map);

//全局变量modal
var modal = document.getElementById("myModal");
//全局变量markerArray
var markerArray=[];
//全局变量grabbed
var grabbed=[];
//全局变量血条计数
var grabbedMarkersCount = 0;
var grabbedMarkers=0;
//全局
var storeData=[];
//username
var userName;
//标签的click事件
function openModal(){
    modal.style.display ="block";
    displayRecordData(this.recordData);}
// 玩家
let playerLevel = 1;
const EXPERIENCE_TO_LEVEL_UP = 3; // 每3经验点升级
//玩家
var currentNarration=0;
var currentCongration=0;


//close按钮
var closeButton = document.querySelector(".close");
//关闭
closeButton.addEventListener("click",function(){
    modal.style.display ="none";
});
//记录这个标记的url
function displayRecordData(textContent,image,title){
    var  modelContent = document.querySelector(".model-content p")
    var  modelpicture = document.querySelector(".model-content img")
    var  modelTitle = document.querySelector(".model-content h1")
    modelContent.textContent = textContent;
    if(image != null){
        modelpicture.src = image;
    }else{
        modelpicture.alt="NO pictures";
    }
    modelTitle.textContent= title;
}

//update 血条
function updateHealthBar(){
    let experiencePercentage = (grabbedMarkersCount / EXPERIENCE_TO_LEVEL_UP) * 100;

    // 更新经验条的宽度
    document.querySelector('.progress').style.width = experiencePercentage + '%';

    // 判断是否升级
    if (grabbedMarkersCount >= EXPERIENCE_TO_LEVEL_UP) {
        playerLevel++;
        grabbedMarkersCount = 0;
        document.querySelector('.level').textContent = 'Level' + playerLevel;
        document.querySelector('.progress').style.width = '0%'; // 经验条归零
    }
    
};

//事件触发时发送ajax到php
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


// // 定时保存，每3秒
setInterval(sendUrlsToServer, 3*1000);

//加标记点的文档
function addPointToMap(lat, lon,recordValue) {
    var marker =L.marker([lat, lon]).addTo(map);
    marker.setIcon(sourceicon)
    var originalSize = [40, 40]; // 假设这是原始大小
    var enlargedSize = [60, 60]; // 放大后的大小
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
    //数据存储到marker对象中
    marker.recordData =recordValue.URL;//url储存了
    console.log("11111111111", marker.recordData);
    marker.marker=recordValue
    marker.image = recordValue['Primary image'];
    //点击时执行括号(事件监听器)
    marker.on("click",function(e){
        //监听点击
        //询问框，询问是否挖掘
        showConfirmationPopup(e.target,marker,function(result){
            supportClick = result;
            marker.isGrab = result;
            if(supportClick){
                playGifAndDelay();
                var self = this;
                setTimeout(function() {
                    // 这里放置你想要延迟执行的代码
                    openModal.call(marker);
                    console.log("11111111111",this.recordData);
                    handleMarkerClick(self.recordData,self.image,marker);
                    //移除旧的事件处理函数
                    $("#narration-container").off("click", showNextNarration);
                    // 绑定新的事件处理函数
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
            // 先移除旧的侧边栏
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
        // 添加新的侧边栏到body
        document.getElementById("map").appendChild(sidebarHtml);
        
        const audio = document.getElementById("sidebarAudio");
        // 播放音效
        audio.play();
    
        document.getElementById("startDig").addEventListener('click', function() {
            if (typeof callback === "function") {
                callback(true);
            }
            clickedMarker.closePopup();
            clickedMarker.unbindPopup();
            //停止音效并重置播放位置
            audio.pause();
            audio.currentTime = 0;
        });
    
        document.getElementById('closeSidebar').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            document.getElementById("map").removeChild(sidebar);
            audio.pause();
            audio.currentTime = 0;
        });

            // 给id为"closebut"的按钮添加关闭侧边栏逻辑
        document.getElementById('closeIcon').addEventListener('click', function () {
            const sidebar = document.getElementById('sidebar');
            document.getElementById("map").removeChild(sidebar);
            audio.pause();
            audio.currentTime = 0;
        });

    } 

// 播放 GIF 并等待三秒
function playGifAndDelay() {
    // 获取对播放 GIF 的 DOM 元素的引用
    var gifElement = document.getElementById('defeat-gif');
    if (gifElement) {
        // 显示 GIF（你可能需要设置合适的样式）
        gifElement.style.display = 'block';
        setTimeout(function() {
            gifElement.style.display = 'none';
        }, 3000); 
    }
}

//侧边框关闭
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
//输入坐标增加标记
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

//点击打开视窗
document.addEventListener("DOMContentLoaded",function(){
});

//button功能，显示当前地址
function showCurrent(){
    if (navigator.geolocation){
        
        navigator.geolocation.getCurrentPosition(function (position){
            var pos = L.latLng(position.coords.latitude,position.coords.longitude);
            L.marker([position.coords.latitude, position.coords.longitude],{icon:userIcon}).addTo(map);
            //定位并放大地图
            map.setView(pos,13);
            //让其他过远的点都不可见
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

//锚点格式,需要调整*
var customIcon = L.icon({
    iconUrl: 'icon\\treasure.png',    // 图标的URL
    iconSize: [50, 50],       // 图标的大小
    iconAnchor: [22, 94],     // 图标的锚点位置，使图标的这个点正好对齐于地图上的对应点
    popupAnchor: [-3, -76]    // 如果你想为这个标记添加一个popup，这个是popup的锚点位置
});

//user图标
var userIcon = L.icon({
    iconUrl: 'user.png',
    iconSize: [60, 60],       // 图标的大小
    iconAnchor: [22, 94],     // 图标的锚点位置，使图标的这个点正好对齐于地图上的对应点
})
//最初的icon
var sourceicon = L.icon({
    iconUrl:  'icon\\dragonicon.png',  // 图片的路径
    iconSize: [60, 50], // 图标的大小
    iconAnchor: [22, 94], // 图标的锚点，确保图标在正确的地方显示
    popupAnchor: [-3, -76] // popup的锚点
});



function showNextNarration() {
    // 隐藏当前的旁白
    $(`#narration-${currentNarration}`).addClass('hidden');
    currentNarration++;

    // 如果还有旁白需要显示
    if (currentNarration <= 5) {
        $(`#narration-${currentNarration}`).removeClass('hidden');
    } else {
        // 所有旁白都显示完后，隐藏按钮
        $('#narration-container button').hide();
    }

}

function congrateNarration() {
    console.log("真的成功绑定了吗");
    //绑定事件
    $('#narration-container button').show();
    // 隐藏当前的旁白
    $(`#narration-${currentNarration}`).addClass('hidden');
    // 隐藏之前显示的祝贺旁白
    $(`#congration-${currentCongration}`).addClass('hidden');
    currentCongration++;
    
    if (currentCongration <= 4) {
        console.log("congrateNarration",currentCongration)
        // 如果还有祝贺旁白需要显示
        $(`#congration-${currentCongration}`).removeClass('hidden');
    } else {
        // 所有祝贺旁白都显示完后，隐藏按钮
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
            if (data && data.includes("请先登录!")) {
                alert('请先登录!');
            } else {
                // 你没有提供用户名在响应中，所以我无法更新它
                console.log("用户已登录，但响应中没有提供用户名");
            }
        },
        error: function() {
            // 当请求失败时的处理
            alert('发生错误，请稍后再试。');
        }
    });
}

