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
  windows.forEach(function(window){
    window.tabs.forEach(function(tab){
      console.log(tab.url);
    });
  });
});

// tab을 열거나 업데이트 될 때
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.url) {
      chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
          window.tabs.forEach(function(tab){
            console.log(tab.url);
          });
        });
      });
    }
});

// tab을 닫을 때
chrome.tabs.onRemoved.addListener(function(tabId, info) {
      chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
          window.tabs.forEach(function(tab){
            console.log(tab.url);
          });
        });
      });
});