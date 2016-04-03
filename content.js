var s = document.createElement('script');
s.src = chrome.extension.getURL('payload.js');
document.body.appendChild(s);

document.addEventListener('upload', function (e) {
    chrome.runtime.sendMessage(JSON.parse(window.localStorage.event), function(response) {})
});

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.method === "download") {
        	var response = {}
            response.data = {
                "event":"downloaded",
                "session": JSON.parse(window.localStorage.sess)
            };
            sendResponse(response);
        }
	}
);
