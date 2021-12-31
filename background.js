let TIME = 0; // 타이머 시간
let limit = 30; // 시간 제한
let cron; // clearInterval을 위한 변수
let movementMethod = 1; // 동작 설정

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

function updateTimer() {
  TIME++;
  chrome.runtime.sendMessage({
    backData: {
      time: TIME,
      limit: limit,
    },
  });
  const checkMinutes = Math.floor(TIME / 60);
  const minutes = checkMinutes % 60;

  // 시간 초과시 YouTube 종료 혹은 경고 메시지
  if (TIME > limit) {
    if (movementMethod === 1) {
      chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(function (window) {
          window.tabs.forEach(function (tab) {
            if (tab.url.indexOf("https://www.youtube.com/") !== -1) {
              chrome.tabs.remove(tab.id, function () {});
            }
          });
        });
      });
    } else if (movementMethod === 2) {
      chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(function (window) {
          window.tabs.forEach(function (tab) {
            if (tab.url.indexOf("https://www.youtube.com/") !== -1) {
              chrome.tabs.sendMessage(tab.id, {
                message: "유튜브 그만 봐!",
              });
            }
          });
        });
      });
    }
  }
}

// 페이지와 통신
chrome.runtime.onConnect.addListener(function (port) {
  // popup에 time과 limit값 보내기
  chrome.runtime.sendMessage({
    backData: {
      time: TIME,
      limit: limit,
    },
  });
  // popup의 limit값 받아오기
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.popupLimit) {
      limit = request.popupLimit;
    }
  });

  chrome.runtime.sendMessage({
    movementMethod: movementMethod,
  });

  // 옵션 받아오기
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.reset) {
      TIME = 0;
    } else if (request.movementMethod) {
      movementMethod = request.movementMethod;
    }
  });
});

// 시작할 때
chrome.windows.getAll({ populate: true }, function (windows) {
  let youtube = 0;
  windows.forEach(function (window) {
    window.tabs.forEach(function (tab) {
      if (tab.url.indexOf("https://www.youtube.com/") !== -1) {
        youtube += 1;
        if (youtube === 1) startButton();
      }
    });
  });
  if (youtube === 0) stopButton();
});

// tab을 열거나 업데이트 될 때
chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  let youtube = 0;
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      window.tabs.forEach(function (tab) {
        if (tab.url.indexOf("https://www.youtube.com/") !== -1) {
          youtube += 1;
          if (youtube === 1) startButton();
        }
      });
    });
  });
  if (youtube === 0) stopButton();
});

// tab을 닫을 때
chrome.tabs.onRemoved.addListener(function (tabId, info) {
  chrome.runtime.sendMessage({
    movementMethod: movementMethod,
  });
  let youtube = 0;
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      window.tabs.forEach(function (tab) {
        if (tab.url.indexOf("https://www.youtube.com/") !== -1) {
          youtube += 1;
          if (youtube === 1) startButton();
        }
      });
    });
  });
  if (youtube === 0) stopButton();
});
