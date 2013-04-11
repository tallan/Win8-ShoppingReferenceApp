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


/// <reference path="ms-appx://Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="ms-appx://Microsoft.WinJS.1.0/js/ui.js" />
/// <reference path="homeViewModel.js" />

(function () {
    "use strict";

    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var api = Shopping.Api;
    var vm = new Shopping.ViewModel.HomeViewModel(api.catalog);

    function HomeLayout(options) {
        /// <summary>
        /// Used to layout the home screen as a post rendering workaround to nesting
        /// a list of <li> elements inside an actual itemTemplate, this is used instead
        /// of a custom renderer in a ListView which would also work here.
        /// </summary>
        
        function layout(item, data) {
            var featuredItemList = item.querySelector('.itemList');
            var simpleFeaturedList = new Shopping.Controls.SimpleList(featuredItemList);
            simpleFeaturedList.itemTemplate = options.template;
            simpleFeaturedList.itemDataSource = data[options.path];

            var links = item.querySelectorAll('a');
            _.each(links, function(link, l) {

                link.addEventListener('click', function (args) {
                    if (WinJS.Utilities.hasClass(args.currentTarget, "areaHeader")) {
                        //Go to Area Page
                        var area = args.currentTarget.getAttribute('data-state');
                        nav.navigate(args.currentTarget.href, { item: area });
                    }
                    else {
                        // Go to Product Page
                        var productId = args.currentTarget.getAttribute('data-state');
                        var product = api.catalog.getProductById(+productId);
                        nav.navigate(args.currentTarget.href, { item: product });
                    }
                    
                    args.preventDefault();
                });
            });

        }

        return {
            layout: layout
        };
    }
    
    ui.Pages.define("/pages/home/home.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector("section[role=main]").winControl;
            listView.itemTemplate = element.querySelector(".itemTemplate");
            listView.layoutManager = new HomeLayout({
                template: element.querySelector('.featuredProductTemplate'),
                path: 'featuredProducts'
            });
            listView.itemDataSource = vm.areas;
                

            var tallan = document.querySelector("#TallanLink");
            if (tallan != null) {
                tallan.addEventListener('click', function (args) {
                    // Go to Tallan.com
                    var uri = Windows.Foundation.Uri("http://www.tallan.com");
                    Windows.System.Launcher.launchUriAsync(uri);
                });
            }
        }
    });
})();
