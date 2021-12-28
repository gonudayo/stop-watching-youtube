const timer = document.querySelector('.js-timer');

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        let TIME = request.msg;
        const hours = Math.floor(TIME/3600);
        const checkMinutes = Math.floor(TIME/60); 
        const seconds = TIME % 60;
        const minutes = checkMinutes % 60;
        
        timer.innerText = `${hours < 10 ? `0${hours}` : hours}:${
            minutes < 10 ? `0${minutes}` : minutes}:${
            seconds < 10 ? `0${seconds}` : seconds}`;
    }
);