if(window.localStorage.robin == undefined)
    window.localStorage.robin = JSON.stringify([]);

var robin = JSON.parse(window.localStorage.robin)
var download = function(d) {
    var data = JSON.stringify(d);
    var url = 'data:application/octet;charset=utf8,' + encodeURIComponent(data);
    window.open(url, '_blank');
    window.focus();
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type == 'set'){
            robin.push(request.data);
            window.localStorage.robin = JSON.stringify(robin);
            download(request.data);
            console.log('Uploaded Baby!');
        } else if(request.type == 'get'){
            var response = {}
            ,len = request.values.length
            ,i = 0;
            while (i < len){
                var value = request.values[i];
                response[value] = window.localStorage[value];
                i++;
            }
            sendResponse(response);
        }else if(request.type == 'download'){
            chrome.tabs.sendRequest(request.tab, {method: "download"}, function(response) {
                if(response) robin.push(response.data);
                download(robin);
                robin = []
                window.localStorage.robin = JSON.stringify(robin);
            });
        }
    }
);