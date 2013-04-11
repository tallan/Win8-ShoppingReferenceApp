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
/// <reference path="api.js" />

(function (WinJS) {
    "use strict";

    function createTileXmlForProduct(templateType, product) {
        /// <summary>
        /// Creates the Tile Xml for a specified product using the manual XML DOM object.  The MSDN Samples contains
        /// a nice C# WinRT component that simplifies this at http://code.msdn.microsoft.com/windowsapps/App-tiles-and-badges-sample-5fc49148
        /// </summary>

        // get a XML DOM version of a specific template by using getTemplateContent       
        var tileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(templateType);

        // You will need to look at the template documentation to know how many text fields a particular template has
        // get the text attributes for this template and fill them in
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode(product.Name + " added to cart."));

        var tileImageAttributes = tileXml.getElementsByTagName("image");
        tileImageAttributes[0].setAttribute("src", product.ThumbnailImage);
        return tileXml;
    }

    var TileUpdater = WinJS.Class.define(function () { }, {

        eventPublished: function (args) {

            if (args.type === Shopping.Api.eventAggregator.type.AddedToCart) {

                var product = Shopping.Api.catalog.getProductById(args.productId);

                var templateTypes = Windows.UI.Notifications.TileTemplateType;
                // Generate Wide/Square tile xml
                var squareTileXml = createTileXmlForProduct(templateTypes.tileSquarePeekImageAndText01, product);
                var tileXml = createTileXmlForProduct(templateTypes.tileWideImageAndText01, product);

                // combine Square and Wide tile
                var squareBindingXml = squareTileXml.getElementsByTagName("binding")[0];
                var wideBindingXml = tileXml.getElementsByTagName("binding")[0];
                var node = tileXml.importNode(squareBindingXml, true);
                wideBindingXml.parentNode.appendChild(node);

                // create the notification from the XML
                var tileNotification = new Windows.UI.Notifications.TileNotification(tileXml);

                // send the notification to the app's application tile
                var primaryTileUpdater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
                primaryTileUpdater.update(tileNotification);
            }
        }

    });

    WinJS.Namespace.define("Shopping", {
        TileUpdater: TileUpdater
    });

})(WinJS);