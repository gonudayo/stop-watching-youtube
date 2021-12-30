chrome.runtime.connect({ name: "option" });

document.getElementById("btn").addEventListener("click", function () {
  chrome.runtime.sendMessage({
    reset: 1,
  });
});
