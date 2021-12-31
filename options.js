chrome.runtime.connect({ name: "option" });

let movementMethod = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.movementMethod) {
    if (request.movementMethod === 1)
      document.getElementById("autoClose").checked = true;
    else if (request.movementMethod === 2)
      document.getElementById("justAlert").checked = true;
  }
});

document.getElementById("autoClose").addEventListener("click", function () {
  movementMethod = 1;
  chrome.runtime.sendMessage({
    movementMethod: 1,
  });
});

document.getElementById("justAlert").addEventListener("click", function () {
  movementMethod = 2;
  chrome.runtime.sendMessage({
    movementMethod: 2,
  });
});

document.getElementById("btn").addEventListener("click", function () {
  chrome.runtime.sendMessage({
    reset: 1,
  });
});
