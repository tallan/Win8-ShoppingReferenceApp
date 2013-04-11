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

(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var api = Shopping.Api;
    var filterBars = [];

    ui.Pages.define("/pages/search/search.html", {
        _lastSearch: "",
        listView: null,

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Namespace.define("search", { markText: WinJS.Binding.converter(this._markText.bind(this)) });

            this.listView = element.querySelector(".resultslist").winControl;
            this.listView.itemTemplate = element.querySelector(".itemtemplate");
            this.listView.oniteminvoked = this._itemInvoked;
            
            this._handleQuery(element, options || designModeSearch);

            this.listView.element.focus();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {

            var firstVisible = this.listView.indexOfFirstVisible;
            this._initializeLayout(this.listView, viewState);
            if (firstVisible >= 0 && this.listView.itemDataSource.list.length > 0) {
                this.listView.indexOfFirstVisible = firstVisible;
            }
        },

        _filterChanged: function (args) {
            var listView = document.querySelector(".resultslist").winControl;
            listView.itemDataSource = args.detail.results;
            
            // clear filter
            for (var fb in filterBars) {
                if (args.currentTarget.winControl != filterBars[fb])
                    filterBars[fb].clearSelection();
            }

            // clear popup and appbar
            var popup = args.currentTarget.parentElement.winControl;
            popup.hide();
            document.getElementById("topAppBar").winControl.hide();
            document.getElementById("searchAppbar").winControl.hide();
        },

        // This function executes each step required to perform a search.
        _handleQuery: function (element, args) {
            var originalResults;
            this._lastSearch = args.queryText;
            originalResults = this._searchData(args.queryText);
            
            document.querySelector(".titlearea .searchTerm").textContent = this._lastSearch;
            document.querySelector(".titlearea .searchItemCount").textContent = originalResults.length;

            this._initializeLayout(element.querySelector(".resultslist").winControl, Windows.UI.ViewManagement.ApplicationView.value);
            if (originalResults.length === 0) {
                document.querySelector('.resultsmessage').style.display = "block";
            } else {
                document.querySelector('.resultsmessage').style.display = "none";
                this.listView.itemDataSource = originalResults.dataSource;
                this._initializeFilter(element, originalResults);

            }
        },

        _initializeFilter: function (element, data) {
            filterBars = [];
            var callbackToShowPopup = function (filterCommand, id) {
                return function (e) {
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
            filterCategoryBar.populate(data);
            filterBars.push(filterCategoryBar);

            // rating
            var filterRatingCommand = element.querySelector("#filterRating");
            filterRatingCommand.addEventListener("click", callbackToShowPopup(filterRatingCommand, "#filterRatingPopup"), false);

            var filterRatingBar = element.querySelector("#filterRatingBar").winControl;
            filterRatingBar.addEventListener("filterchanged", this._filterChanged);
            filterRatingBar.filters = api.catalog.getRatingsAsFilters();
            filterRatingBar.populate(data);
            filterBars.push(filterRatingBar);

            // price
            var filterPriceCommand = element.querySelector("#filterPrice");
            filterPriceCommand.addEventListener("click", callbackToShowPopup(filterPriceCommand, "#filterPricePopup"), false);

            var filterPriceBar = element.querySelector("#filterPriceBar").winControl;
            filterPriceBar.addEventListener("filterchanged", this._filterChanged);
            filterPriceBar.filters = api.catalog.getPricesAsFilters();
            filterPriceBar.populate(data);
            filterBars.push(filterPriceBar);
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />
            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },

        _itemInvoked: function (args) {
            // If the page is not snapped, the user invoked an item.
            args.detail.itemPromise.done(function itemInvoked(item) {
                nav.navigate("/pages/productDetail/productDetail.html", { item: item.data });
            });
        },

        // This function colors the search term. Referenced in /pages/search/search.html
        // as part of the ListView item templates.
        _markText: function (text) {
            return text.replace(this._lastSearch, "<mark>" + this._lastSearch + "</mark>");
        },

        // This function populates a WinJS.Binding.List with search results for the
        // provided query.
        _searchData: function (queryText) {
            var list = new WinJS.Binding.List(api.catalog.search(queryText));
            return list;
        }
    });
})();
