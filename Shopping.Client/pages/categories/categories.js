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
/// <reference path="categoriesViewModel.js" />

(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var api = Shopping.Api;
    var vm = new Shopping.ViewModel.CategoriesViewModel(api.catalog);
    var backButton;
    var page;
    var filterBars = [];

    ui.Pages.define("/pages/categories/categories.html", {
        
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            vm.init(options ? options.item : designModeAreaName);

            page = this;
            backButton = element.querySelector('#backButton');

            var zoomControl = element.querySelector(".zoomcontrol").winControl;
            zoomControl.addEventListener("zoomchanged", this._zoomChanged, false);

            var header = element.querySelector('.snappedHeader .pagetitle');
            header.textContent = vm.area;

            var productsListView = element.querySelector(".productslist").winControl;
            productsListView.groupHeaderTemplate = element.querySelector(".headertemplate");
            productsListView.itemTemplate = element.querySelector(".itemtemplate");
            productsListView.oniteminvoked = this._itemInvoked.bind(this);
            var categoriesListView = element.querySelector(".categorieslist").winControl;
            categoriesListView.itemTemplate = element.querySelector(".zoomedouttemplate");

            this._initializeFilter(element);

            this._initializeLayout(productsListView, categoriesListView, appView.value);
        },

        _zoomChanged: function(e) {
            if (e.detail) {
                backButton.style.display = 'none';
            } else {
                backButton.style.display = 'block';
            }
        },

        _initializeFilter: function (element) {
            filterBars = [];
            
            var callbackToShowPopup = function(filterCommand, id) {
                return function(e) {
                    var flyout = element.querySelector(id).winControl;
                    flyout.anchor = filterCommand;
                    flyout.placement = "top";
                    flyout.alignment = "left";
                    flyout.show();
                };
            };

            // category
            var filterCategoryCommand = element.querySelector("#filterCategory");
            filterCategoryCommand.addEventListener("click", callbackToShowPopup(filterCategoryCommand, "#filterCategoryPopup"), false);
            
            var filterCategoryBar = element.querySelector("#filterCategoryBar").winControl;
            filterCategoryBar.addEventListener("filterchanged", this._filterChanged);
            filterCategoryBar.filters = api.catalog.getCategoriesAsFilters();
            filterBars.push(filterCategoryBar);

            // rating
            var filterRatingCommand = element.querySelector("#filterRating");
            filterRatingCommand.addEventListener("click", callbackToShowPopup(filterRatingCommand, "#filterRatingPopup"), false);
            
            var filterRatingBar = element.querySelector("#filterRatingBar").winControl;
            filterRatingBar.addEventListener("filterchanged", this._filterChanged);
            filterRatingBar.filters = api.catalog.getRatingsAsFilters();
            filterBars.push(filterRatingBar);

            // price
            var filterPriceCommand = element.querySelector("#filterPrice");
            filterPriceCommand.addEventListener("click", callbackToShowPopup(filterPriceCommand, "#filterPricePopup"), false);

            var filterPriceBar = element.querySelector("#filterPriceBar").winControl;
            filterPriceBar.addEventListener("filterchanged", this._filterChanged);
            filterPriceBar.filters = api.catalog.getPricesAsFilters();
            filterBars.push(filterPriceBar);
        },

        _filterChanged: function(args) {
            var productsListView = document.querySelector(".productslist").winControl;
            if (args.detail.index === 0) {
                productsListView.itemDataSource = vm.categories.dataSource;
                productsListView.groupDataSource = vm.categories.groups.dataSource;
            } else {
                productsListView.itemDataSource = args.detail.results;
                productsListView.groupDataSource = null;
            }
            
            // clear filters
            for (var fb in filterBars) {
                if (args.currentTarget.winControl != filterBars[fb])
                    filterBars[fb].clearSelection();
            }

            // hide popup and appbars
            var popup = args.currentTarget.parentElement.winControl;
            popup.hide();
            document.getElementById("topAppBar").winControl.hide();
            document.getElementById("categoriesAppbar").winControl.hide();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var productsListView = element.querySelector(".productslist").winControl;
            var categoriesListView = element.querySelector(".categorieslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        productsListView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    productsListView.addEventListener("contentanimating", handler, false);
                    this._initializeLayout(productsListView, categoriesListView, viewState);
                }
            }
        },

        // This function updates the productsListView with new layouts
        _initializeLayout: function (productsListView, categoriesListView, viewState) {
            /// <param name="productsListView" value="WinJS.UI.productsListView.prototype" />

            var filterCategoryBar = document.getElementById("filterCategoryBar").winControl;
            filterCategoryBar.populate(vm.list);
            var filterRatingBar = document.getElementById("filterRatingBar").winControl;
            filterRatingBar.populate(vm.list);
            var filterPriceBar = document.getElementById("filterPriceBar").winControl;
            filterPriceBar.populate(vm.list);

            if (viewState === appViewState.snapped) {
                productsListView.itemDataSource = vm.categories.dataSource;
                productsListView.groupDataSource = null;
                productsListView.layout = new ui.ListLayout();
            } else {
                productsListView.itemDataSource = vm.categories.dataSource;
                productsListView.groupDataSource = vm.categories.groups.dataSource;
                productsListView.layout = new ui.GridLayout({ groupHeaderPosition: "left" });
            }

            categoriesListView.itemDataSource = vm.categories.groups.dataSource;
            categoriesListView.groupDataSource = null;
            categoriesListView.layout = new ui.GridLayout({ groupHeaderPosition: "top" });
        },

        _itemInvoked: function (args) {
            // If the page is not snapped, the user invoked an item.
            var item = vm.categories.getAt(args.detail.itemIndex);
            nav.navigate("/pages/productDetail/productDetail.html", { item: item });
        }
    });
})();
