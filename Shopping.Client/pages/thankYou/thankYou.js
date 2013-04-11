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
    
    var nav = WinJS.Navigation;

    WinJS.UI.Pages.define("/pages/thankYou/thankYou.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var cartBtn = document.getElementById("CartBtn");
            var label = WinJS.Utilities.query('.win-label', cartBtn)[0];
            label.textContent = "Cart (0)";

            var close = element.querySelector('.close');
            close.addEventListener('click', function () {
                nav.navigate('/pages/home/home.html');
            });
            
        },
    });
})();
