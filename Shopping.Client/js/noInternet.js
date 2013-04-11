//*************************************************************************
//
//    Copyright (c) 2013 Tallan Inc.  All rights reserved. 
//
//    Use of this sample source code is subject to the terms of the Microsoft Limited Public License
//    at http://msdn.microsoft.com/en-us/cc300389.aspx#P and is provided AS-IS. 
//
//    For more information about Tallan, visit our website, http://tallan.com/.     
//
//    To see the topic that inspired this sample app, go to http://msdn.microsoft.com/en-us/library/windows/apps/jj635241. 
//
//*************************************************************************


(function () {
    "use strict";

    // Displays the no internet screen.
    function show(reloadCallback) {
        
        var noInternet = document.getElementById("noInternet");
        var reload = document.getElementById("reload");
        reload.addEventListener("click", reloadCallback);

        WinJS.Utilities.removeClass(noInternet, "hidden");
    }

    // Checks whether the no internet screen is visible and returns a boolean.
    function isVisible() {
        var noInternet = document.getElementById("noInternet");
        return !(WinJS.Utilities.hasClass(noInternet, "hidden"));
    }

    // Removes the no internet screen if it is currently visible.
    function remove() {
        if (isVisible()) {
            var noInternet = document.getElementById("noInternet");
            WinJS.Utilities.addClass(noInternet, "hidden");
        }
    }

    WinJS.Namespace.define("NoInternet", {
        show: show,
        isVisible: isVisible,
        remove: remove
    });
})();
