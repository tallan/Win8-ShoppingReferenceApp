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
/// <reference path="/js/api.js" />

(function (WinJS) {
    "use strict";

    var SharingProvider = WinJS.Class.define(function () {
        /// <summary>
        /// A sharing provider is a stateful manager for responding to share charm commands.  The constructor listens to the datarequested event
        /// and there should only be one instance within an application.
        /// </summary>

        var self = this;
        var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dataTransferManager.addEventListener("datarequested", function (args) {
            self.dataRequested(args);
        });

        this._setFieldsByLocation();

    }, {

        eventPublished: function (args) {
            /// <summary>
            /// Event handler for published events from the EventAggregator.  The SharingProvider listens to Navigation events and
            /// updates the current state based on the location.
            /// </summary>
            
            if (args.type === Shopping.Api.eventAggregator.type.Navigated) {

                this._setFieldsByLocation(args.location, args.state);
                
            }
        },

        _setFieldsByLocation: function(location, state) {
            if (/productDetail.html$/.test(location)) {

                this.currentTitle = "Shopping Reference App - " + state.item.Name;
                this.currentDescription = state.item.Description;
                this.currentPage = "product";
                this.additionalQuery = "&productId=" + state.item.ProductId;

            } else if (/categories.html$/.test(location)) {

                this.currentTitle = "Shopping Reference App - Products for " + state.item;
                this.currentDescription = state.item;
                this.currentPage = "categories";
                this.additionalQuery = "&area=" + state.item;

            } else {

                this.currentTitle = "Shopping Reference App - Home";
                this.currentDescription = "Download the Shopping Reference App from the above link.";
                this.currentPage = "home";
                this.additionalQuery = "";

            }
        },

        dataRequested: function (e) {
            var request = e.request;

            request.data.properties.title = this.currentTitle;
            request.data.properties.description = this.currentDescription;

            request.data.setUri(new Windows.Foundation.Uri("http://www.tallan.com/solutions/ecommerce/?page=" + this.currentPage + this.additionalQuery));
        }

    });

    WinJS.Namespace.define("Shopping", {
        SharingProvider: SharingProvider
    });

})(WinJS);