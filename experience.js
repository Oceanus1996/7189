//全局变量markerArray
var grabbed=[]
var grabbedMarkersCount=0;
// 玩家
let playerLevel = 1;
const EXPERIENCE_TO_LEVEL_UP = 3; // 每3经验点升级

//页面加载完成后
$(document).ready(function() {
    console.log("Document is ready!");
    //从basic.js移植
    let cards = document.querySelectorAll('.container .card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
        card.classList.remove('locked');
            card.classList.add('unlocked');
        });
    });


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

    
    
});
function displayRecordData( image, title,url) {
    // 1. 找到第一个空白的卡片
    let emptyCard = document.querySelector(".big-container .container.empty");
    if (!emptyCard) {
        console.error("No empty card found!");
        return;
    }

    // 2. 填充数据到这个空白的卡片
    let imgBox = emptyCard.querySelector(".imgBx img");
    let contentBox = emptyCard.querySelector(".content");
    if (imgBox && contentBox) {
        imgBox.src = image;

        // let titleElem = contentBox.querySelector("h2");
        // let textElem = contentBox.querySelector("p");
        
    // 创建超链接部分
    let newLink = document.createElement("a");
    newLink.href = url;  // 设置超链接的目标
    newLink.textContent = title;  // flex使用传入的textContent参数作为链接文本
    contentBox.appendChild(newLink);
         // 显示这个卡片
         emptyCard.style.display = 'flex';  // 这里将卡片设置为显示状态
         console.log(emptyCard.style.display+"这里将卡片设置为显示状态" );

    // Remove the 'empty' class as this card is no longer empty
    emptyCard.classList.remove('empty');
    }
}

//创建新的空白卡片
function addEmptyCard() {
    // 获取大的容器
    console.log("测试真的家没有");
    let bigContain = document.querySelector(".big-container");
    console.log("bigContain"+bigContain);

    // 创建一个新的container
    let newContainer = document.createElement('div');
    newContainer.className = 'container empty';
    // newContainer.style.display = 'none';  // 默认设置为隐藏

    // 创建card元素
    let card = document.createElement('div');
    card.className = 'card';

    // 创建imgBx元素并其中的img元素
    let imgBx = document.createElement('div');
    imgBx.className = 'imgBx';
    let img = document.createElement('img');
    img.src = "icon/locked.png";
    img.alt = "";
    imgBx.appendChild(img);
    card.appendChild(imgBx);

    // 创建content元素并其中的h2和p元素
    let content = document.createElement('div');
    content.className = 'content';
    let h2 = document.createElement('h2');
    let p = document.createElement('p');
    content.appendChild(h2);
    content.appendChild(p);
    card.appendChild(content);

    // 将card元素添加到newContainer中
    newContainer.appendChild(card);

    // 将新创建的容器添加到大容器中
    bigContain.appendChild(newContainer);
    console.log("测试真的家没有"+newContainer);
     // 重新绑定点击事件
    let newCard = newContainer.querySelector('.card');
    newCard.addEventListener('click', function() {
        newCard.classList.remove('locked');
        newCard.classList.add('unlocked');
    });
      
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



