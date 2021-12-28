let TIME = 0;
let cron; // clearInterval을 위한 변수

function startButton() {
  updateTimer();
  stopButton();
  cron = setInterval(updateTimer, 1000);
  // timer.classList.add('hide');
}

function stopButton() {
  clearInterval(cron);
  // timer.classList.remove('hide');
}

function updateTimer(){
    TIME++;
    console.log(TIME)
    chrome.runtime.sendMessage({
      msg: TIME
  });
}



chrome.tabs.onUpdated.addListener(
  function(tabId, info, tab) {
    // read info data and do something with it
    // like send the new url to contentscripts.js
    if (info.url) {
      // 현재 탭으로 url 전송
      chrome.tabs.sendMessage( tabId, {
        message: 'hello!',
        url: info.url
      })
    }
  }
);

// 시작할 때
chrome.windows.getAll({populate:true},function(windows){
  let youtube = 0;
  windows.forEach(function(window){
    window.tabs.forEach(function(tab){
      if(tab.url.indexOf('https://www.youtube.com/') !== -1) {
        youtube += 1;
        if(youtube === 1) startButton();
      }
      console.log(tab.url);
    });
  });
  if(youtube === 0) stopButton();
});

// tab을 열거나 업데이트 될 때
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  let youtube = 0;
      chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
          window.tabs.forEach(function(tab){
            if(tab.url.indexOf('https://www.youtube.com/') !== -1) {
              youtube += 1;
              if(youtube === 1) startButton();
            }
            console.log(tab.url);
          });
        });
      });
    if(youtube === 0) stopButton();
});

// tab을 닫을 때
chrome.tabs.onRemoved.addListener(function(tabId, info) {
  let youtube = 0;
      chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
          window.tabs.forEach(function(tab){
            if(tab.url.indexOf('https://www.youtube.com/') !== -1) {
              youtube += 1;
              if(youtube === 1) startButton();
            }
            console.log(tab.url);
          });
        });
      });
  if(youtube === 0) stopButton();
});


