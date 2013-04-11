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

    // Displays the extended splash screen. Pass the splash screen object retrieved during activation.
    function show(splash) {

        // Position the extended splash screen's progress ring. Note: In this sample, the progress ring is not used.
        var extendedSplashProgress = document.getElementById("extendedSplashProgress");
        extendedSplashProgress.style.marginTop = splash.imageLocation.y + splash.imageLocation.height + 32 + "px";

        // Once the extended splash screen is setup, apply the CSS style that will make the extended splash screen visible.
        var extendedSplashScreen = document.getElementById("extendedSplashScreen");
        WinJS.Utilities.removeClass(extendedSplashScreen, "hidden");
    }

    // Updates the location of the extended splash screen image. Should be used to respond to window size changes.
    function updateImageLocation(splash) {
        if (isVisible()) {
            // Position the extended splash screen's progress ring. Note: In this sample, the progress ring is not used.
            var extendedSplashProgress = document.getElementById("extendedSplashProgress");
            extendedSplashProgress.style.marginTop = splash.imageLocation.y + splash.imageLocation.height + 32 + "px";
        }
    }

    // Checks whether the extended splash screen is visible and returns a boolean.
    function isVisible() {
        var extendedSplashScreen = document.getElementById("extendedSplashScreen");
        return !(WinJS.Utilities.hasClass(extendedSplashScreen, "hidden"));
    }

    // Removes the extended splash screen if it is currently visible.
    function remove() {
        if(isVisible()) {
            var extendedSplashScreen = document.getElementById("extendedSplashScreen");
            WinJS.Utilities.addClass(extendedSplashScreen, "hidden");
        }
    }

    WinJS.Namespace.define("ExtendedSplash", {
        show: show,
        updateImageLocation: updateImageLocation,
        isVisible: isVisible,
        remove: remove
    });
})();
