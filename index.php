<?php include 'username.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=768, initial-scale=1">
    <title>Adventure</title>
    <link rel="stylesheet" href="basic.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""/>
    <script src="js/code.jquery.com_jquery-3.6.0.min.js"></script>
    <script src="js/unpkg.com_leaflet@1.9.4_dist_leaflet.js"></script>
    <link rel="stylesheet" href="mvp.css">
</head>
<body>
   
    <header>
        <input type="checkbox" id="toggler">     
        <label for="toggler">
          <span class="hambuger-container">
            <span></span>
            <span></span>
          </span>
        </label>
        
        <div class="nav-items">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="#">Tourist</a></li>
            <li><a href="#">Adventure</a></li>
            <li><a href="#">Education</a></li>
            <li><a href="experience.html">Experience</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Register</a></li>

          </ul>
        </div>
        <img src="logo.png" alt="logo" class="logo">

        <a href="index.html">
          <img src="icon/home.png" alt="home" class="home">
        </a>

    </header>

    <!-- map放置处 -->
    <div ,class="modal" id="all-cont">
      <h1>欢迎, <?php echo $username; ?>!</h1>
        <div class="model-content" id = "myModal">
            <span class="close">&times;</span>
            <!-- 弹窗内容 -->
            <h1>默认标题</h1>
            <img>
            <p>图片的标注</p>
        </div>
        <div id="map">  
          
          <div id="dialogue-column">
              <img src="icon/female.png" alt="Person" class="person-image">
              <!-- 对话框 -->
              <div class="dialogue-box">
                <div id="narration-container" >
                  <p class="narration" id="narration-1">世界已经陷入危机。</p>
                  <p class="narration hidden" id="narration-2">海水变成火焰，乐园化为焦土。</p>
                  <p class="narration hidden" id="narration-3">唯有你能拯救这一切。</p>
                  <p class="narration hidden" id="narration-4">看到图上的恶龙了吗</p>
                  <p class="narration hidden" id="narration-5">他们是世界陷入痛苦的源泉，他们吸食人的记忆为生</p>
                  <p class="narration hidden" id="congration-1">恭喜你，打败了他，夺回了记忆</p>
                  <p class="narration hidden" id="congration-2">就是这样，一路下去，我们可以夺回我们的世界</p>
                  <p class="narration hidden" id="congration-3">记忆证明了我们存在的价值</p>
                  <p class="narration hidden" id="congration-4">你守护了他们，继续努力</p>
              
                  <button id="navabutton" onclick="showNextNarration()">点击继续</button>
                
                </div>
                
              </div>
          </div>
        </div> 
        <div class="buttoncontainer">
          <button type="button" onclick="showCurrent()" class="locationbutton">Current location</button>
        </div>
      
    </div>

 

    <script src="mvp.js"></script>
    <footer>
      <a href="experience.html">
        <img src="icon/touxiang.webp" alt="user" class="user">
      </a>

      <div class="exp">
        <span class="level">Level1</span>
        <div class="progress-bar">
            <div class="progress"></div>
      </div>
    </div>
    
    <audio id="sidebarAudio" preload="auto">
      <source src="path_to_your_audio_file.mp3" type="audio/mpeg">
      您的浏览器不支持audio元素。
    </audio>
  
 
    </footer>
    <!-- 固定高度为可视高度 -->
    <script>
      document.body.style.height = window.innerHeight + 'px';
      $(function () {
          $.ajax({
              url: "check_login.php",
              method: "GET",
              success: function(msg) {
                  if (msg == 1){
                      window.location="login.html";
                  }
              },
          })
      })
    </script>

        

</body>
</html>