chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === 'stop') {
      alert('STOP');
    }
});