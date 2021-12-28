const timer = document.querySelector('.js-timer');
let limit = 0;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        let TIME = request.data.time;
        const hours = Math.floor(TIME/3600);
        const checkMinutes = Math.floor(TIME/60); 
        const seconds = TIME % 60;
        const minutes = checkMinutes % 60;
        limit = request.data.limit;
        output.innerHTML = limit;
        slider.value = limit;
        timer.innerText = `${hours < 10 ? `0${hours}` : hours}:${
            minutes < 10 ? `0${minutes}` : minutes}:${
            seconds < 10 ? `0${seconds}` : seconds}`;
    }
);

var slider = document.getElementById("myRange");
var output = document.getElementById("value");
output.innerHTML = limit;

slider.oninput = function() {
    output.innerHTML = this.value;
    chrome.runtime.sendMessage({
        msg: this.value
    });
}