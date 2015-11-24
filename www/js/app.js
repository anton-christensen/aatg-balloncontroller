var app = {
    screenStack: [],
    subpageStack: [],
    pageData: {},
    cache: {},
    enviroment: false,

    conTLoop: undefined,
    // Application Constructor
    initialize: function () {
        app.bindEvents();
        console.log("App initialized");
    },
    isos: function (os) {
        return os == this.enviroment;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            switch(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.exec(navigator.userAgent)[0]) {
                case "iPhone":
                case "iPod":
                case "iPad":
                    this.enviroment = "ios";
                default:
                    this.enviroment = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.exec(navigator.userAgent)[0];
            }
            $.getScript("cordova.js"); // for testing only!
             
            document.addEventListener("deviceready", this.onDeviceReady, false);
        } else  {
            this.enviroment = "web";
            // $.getScript("cordova_win8.js"); // for testing only!
            $(document).ready(this.onDeviceReady);
        }
 
    },
    onPause: function() {
        console.log("Paused");
        bluetoothSerial.disconnect();
        app.pageData.mac = undefined;
    },
    // Fires when the app is resumed after a pause
    onResume: function()  {
        console.log("Resumed");
        if(app.subpageStack[app.subpageStack.length-1] == "screens/control.html")
            app.loadPrevSubpage();
    },
    onBackButton: function(e) {
        console.log("back!!");
        if(app.subpageStack.length > 1)
            app.loadPrevSubpage();
        else
            navigator.app.exitApp();
        e.preventDefault();
        e.stopPropagation();
        return false;
    },
    onResize: function() {
        console.log("resized");
    },
    // Load screen
    //
    // displays the screen and adds its id to the app screen stack
    loadScreen: function (path, reverse, transi) {
        if(transi == undefined)
            transi = "slide";
        // window.setTimeout(function(){$("body > .screen").eq(1).removeAttr('style');},500);
        $("body > .screen").eq(1).load(path, function() {
            $.mobile.changePage("#"+$("body > .screen").eq(1).attr("id"), { transition: transi, reverse: (reverse ? reverse : false), changeHash: false });
            $("body > .screen").eq(0).before($("body > .screen").eq(1));
            $("body > .screen").trigger("create");
            app.subpageStack.splice(0, app.subpageStack.length);
        });
    },
    loadPrevScreen: function () {
        if(this.screenStack.length) {
            this.screenStack.pop();
            this.loadScreen(this.screenStack[this.screenStack.length-1], 1);
        }
    },
    loadNewScreen: function (path, reverse, transi) {
        path = "screens/"+path+".html";
        $.ajax({
            url:path,
            type:'HEAD',
            error: function()   {
                console.log("File: " + path + "; not found")
            },
            success: function() { 
                app.screenStack.push(path);
                app.loadScreen(path, reverse, transi);
            }
        });
    },
    loadSubpage: function(path, reverse) {
        if(!reverse)
            reverse = false;
        $("body > .screen:eq(0) .subpage").css('left', '0');
        $("body > .screen:eq(0) .subpage").after($("<div class='subpage-transporter'></div>"));
        $("body > .screen:eq(0) .subpage-transporter").load(path, function() {
            $(".subpage-transporter .subpage").css('left', (reverse ? '-':'')+'100%');
             
            // move outside transporter
            $(".subpage-transporter .subpage").insertBefore($(".subpage-transporter"));
            $(".subpage-transporter").remove();
 
            $("body > .screen:eq(0) .subpage").eq(0).css('z-index', '1');
            $("body > .screen:eq(0) .subpage").eq(1).css('z-index', '2');
            $("body > .screen:eq(0) .subpage").css('transition', 'left 0.25s cubic-bezier(0,0,0.85,1)');
            $("body > .screen:eq(0) .subpage").eq(1).trigger("create");
            $("body > .screen:eq(0) .subpage").css('left', (reverse ? '+':'-')+'='+$(window).width());
            window.setTimeout(function() {
                $("body > .screen:eq(0) .subpage").eq(0).remove();
                $(".subpage").css('transition', '');
            },300);
        });
    },
    loadFirstSubpage: function() {
        this.subpageStack.splice(1, app.subpageStack.length-1);
        this.loadSubpage(this.subpageStack[0],true);
    },
    loadPrevSubpage: function (n) {
        if(n == undefined)
            n = 1;
        while(this.subpageStack.length && n--) {
            this.subpageStack.pop();
        }
        this.loadSubpage(this.subpageStack[this.subpageStack.length-1], true);
    },
    loadNewSubpage: function(path) {
        path = "screens/"+path+".html";
        $.ajax({
            url:path,
            type:'HEAD',
            error: function()   {
                console.log("File: " + path + "; not found")
            },
            success: function() { 
                if(app.subpageStack.length == 0)
                    app.subpageStack.push("screens/connect.html");
                app.subpageStack.push(path);
                app.loadSubpage(path);
            }
        });
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        document.addEventListener("pause", app.onPause, false);
        document.addEventListener("resume", app.onResume, false);
        document.addEventListener("backbutton", app.onBackButton, false);
        $('screen').css('min-height', $(window).height());
        window.setTimeout(function() {
            app.loadNewScreen("connect");
        },1000);
    }
};