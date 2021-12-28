let TIME = 0; // 타이머 시간
let limit = 30; // 시간 제한
let cron; // clearInterval을 위한 변수

function startButton() {
  updateTimer();
  stopButton();
  cron = setInterval(updateTimer, 1000);
}

function stopButton() {
  clearInterval(cron);
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function updateTimer(){
  TIME++;
  const checkMinutes = Math.floor(TIME/60); 
  const minutes = checkMinutes % 60;

  // 시간 초과시 stop 메시지 발송
  if(minutes >= limit) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var currTab = tabs[0];
      if (currTab !== undefined) { 
        console.log(currTab)
        chrome.tabs.sendMessage( currTab.id, {
          message: 'stop'
        })
      }
    });
  }

  // popup의 limit값 받아오기
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        limit = request.msg;
    }
  );
  
  //popup에 time과 limit값 보내기
  chrome.runtime.sendMessage({
    msg: 'success',
    data: {
      time: TIME,
      limit: limit
    }
  });
}

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
