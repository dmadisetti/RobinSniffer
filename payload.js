window.onload = function(){
    if((".robin-message--message").length)
    ! function(e, t, n) {
        "use strict";
        window.sess = {};
        if(window.localStorage.sess){
            try {
                window.sess = JSON.parse(window.localStorage.sess) || {}
            } catch (e) {
                window.localStorage.sess = "{}";
            }
        }
        var stamp = function(x){
                return {'time':(new Date()).getTime(),'data':x}
            },
            r = e.robin.models,
            i = e.robin.views,
            s = Backbone.View.extend({
                websocketEvents: {

                  // Nice for display
                    connecting: function() {
                        this.addSystemAction("connecting")
                    },
                    connected: function() {
                        this.addSystemAction("connected!")
                    },
                    disconnected: function() {
                        this.addSystemAction("disconnected :(")
                    },
                    reconnecting: function(e) {
                        this.addSystemAction("reconnecting in " + Math.floor(e / 1e3) + " seconds...")
                    },
                    "message:please_vote": function(e) {
                        this.addSystemAction("polls are closing soon, please vote")
                    },
                    "message:system_broadcast": function(e) {
                        this.addSystemMessage(e.body)
                    },

                    // Data we care about
                    "message:chat": function(e) {
                        window.sess[e.from].messages.push(stamp(e.body));
                        window.localStorage.sess = JSON.stringify(sess);
                    },
                    "message:vote": function(e) {
                        window.sess[e.from].votes.push(stamp(e.vote));
                        window.localStorage.sess = JSON.stringify(sess);
                    },
                    "message:join": function(e) {
                        window.sess[e.user].left += 1;
                        window.localStorage.sess = JSON.stringify(sess);
                    },

                    "message:users_abandoned": function(e) {
                        if (!e.users || !e.users.length) return;
                        e.users.forEach(function(e) {

                            // Record Abandon

                        }, this)
                    },

                    "message:abandon": function(e) {
                      this.upload("abandon");
                    },

                    "message:continue": function(e) {
                      this.upload("continue");
                    },
                    "message:no_match": function(e) {
                      this.upload("matchless");
                    },
                    "message:merge": function(e) {
                      this.upload("merge");
                    },
                },
                upload: function(e) {
                    var message = {
                        type:'set',
                        data: {
                            "event":e,
                            "session":window.sess
                        }
                    }

                    var event = document.createEvent("HTMLEvents");
                    event.initEvent("upload", true, true);
                    document.body.dispatchEvent(event)

                    window.localStorage.sess = null;
                },
                initialize: function(s) {
                    this.websocketEvents = this._autobind(this.websocketEvents),
                    this.room = new r.RobinRoom({
                        room_id: this.options.room_id,
                        room_name: this.options.room_name,
                        winning_vote: this.options.is_continued ? "CONTINUE" : undefined
                    });
                    var u = [];
                    s.participants && s.participants.forEach(function(e) {
                        var t = e.name === s.logged_in_username,
                            i = n.clone(e);
                        t && (i.userClass = "self", i.present = !0);
                        var a = new r.RobinUser(i);
                        if (window.sess[e.name] == undefined)
                        window.sess[e.name] = {
                          "messages":[],
                          "votes":[stamp(e.vote)],
                          "left":0
                        };
                    })
                    window.localStorage.sess = JSON.stringify(window.sess);
                    var self = this;
                    // Create new session
                    setTimeout(function(){return function(){ 
                                self.room.postVote(0);
                    }}(), 1500);
                    this.websocket = new e.WebSocket(s.websocket_url), 
                    this.websocket.on(this.websocketEvents), 
                    this.websocket.start();
                },
                _listenToEvents: function(e, t) {
                    for (var n in t) this.listenTo(e, n, t[n])
                },
                _autobind: function(e) {
                    var t = {};
                    for (var n in e) t[n] = e[n].bind(this);
                    return t
                },
                addSystemMessage: function(e) {
                    console.log(e)
                },
                addSystemAction: function(e) {
                    console.log(e)
                }
            });
        t(function() {
            new s({
                el: document.getElementById("robinChat"),
                is_continued: e.config.robin_room_is_continued,
                room_name: e.config.robin_room_name,
                room_id: e.config.robin_room_id,
                websocket_url: e.config.robin_websocket_url,
                participants: e.config.robin_user_list,
                reap_time: parseInt(e.config.robin_room_reap_time, 10),
                logged_in_username: e.config.logged
            })
        })
    }(r, jQuery, _);
};

// Stolen from
// @name Robin Grow
// Thanks boo

var needToVote = true;
if ($(".robin-message--message:contains('that is already your vote')").length) {
    needToVote = false;
}
if (needToVote && $(".robin-message--message:contains('that is already your vote')").length === 0) {
    var oldVal = $(".text-counter-input").val();
    $(".text-counter-input").val("/vote " + "grow").submit();
    $(".text-counter-input").val(oldVal);
}

// Try to join if not currently in a chat
if ($("#joinRobinContainer").length) {
    $("#joinRobinContainer").click();
    setTimeout(function() {
        $("#joinRobin").click();
        location.reload(true);
    }, 500);
}

window.onpopstate = function (event) {
    location.reload(true);
}
