// Copyright (c) 2013 The Dylan Madisetti. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Highlight soon as ready.
// Synchronous Hacks
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').onclick = function(){
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
            chrome.runtime.sendMessage({type:'download', tab:tabs[0].id}, function(response) {});
        });
    }
});