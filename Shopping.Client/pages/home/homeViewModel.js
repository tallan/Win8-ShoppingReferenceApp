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

(function (api) {
    "use strict";

    WinJS.Namespace.define("Shopping.ViewModel", {
        HomeViewModel: WinJS.Class.define(function HomeViewModel_ctor(catalog) {
            this.areas = catalog.getAreas();
        }, {
            init: function () { }
        })
    });

})(Shopping.Api);