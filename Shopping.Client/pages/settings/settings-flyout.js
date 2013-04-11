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


/// <reference path="/js/api.js" />

(function (api) {
    "use strict";

    WinJS.UI.Pages.define("/pages/settings/settings-flyout.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var dropdown = element.querySelector("#sltServices");
            dropdown.addEventListener('change', function () {

                api.settings.useOffline = +dropdown.value;

            }, false);
            
            if (api.settings.useOffline) {
                dropdown.selectedIndex = 1;
            }
        }
    });

})(Shopping.Api)
