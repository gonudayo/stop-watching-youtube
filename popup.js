chrome.runtime.connect({ name: "popup" });

const timer = document.querySelector(".js-timer");
let limit = 0;
let pause = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.backData) {
    let TIME = request.backData.time;
    const hours = Math.floor(TIME / 3600);
    const checkMinutes = Math.floor(TIME / 60);
    const seconds = TIME % 60;
    const minutes = checkMinutes % 60;
    if (request.backData.limit) {
      limit = request.backData.limit;
      output.innerHTML = limit;
      slider.value = limit;
    }
    if (request.backData.pause !== undefined) {
      pause = request.backData.pause;
      if (pause) {
        document.getElementById("ctrbtn").innerText = "재시작";
      } else {
        document.getElementById("ctrbtn").innerText = "일시정지";
      }
    }
    timer.innerText = `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
});

var slider = document.getElementById("sldrRange");
var output = document.getElementById("value");

slider.oninput = function () {
  output.innerHTML = this.value;
  chrome.runtime.sendMessage({
    popupLimit: this.value,
  });
};

document.getElementById("btn").addEventListener("click", function () {
  chrome.runtime.openOptionsPage();
});

document.getElementById("ctrbtn").addEventListener("click", function () {
  document.getElementById("ctrdsc").innerHTML = "자리를 비울 때만 사용하세요!";
  pause = !pause;
  if (pause) {
    document.getElementById("ctrbtn").innerText = "재시작";
  } else {
    document.getElementById("ctrbtn").innerText = "일시정지";
  }
  chrome.runtime.sendMessage({
    popupPause: pause,
  });
});
