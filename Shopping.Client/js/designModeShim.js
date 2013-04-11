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


// This class is a design mode shim for loading design mode state to support
// designing the app with Expression Blend

if (Windows.ApplicationModel.DesignMode.designModeEnabled) {
    Shopping.Api.loadCatalogAsync();

    var designModeProduct = Shopping.Api.catalog.products[0];
    var designModeAreaName = designModeProduct.Area;

    Shopping.Api.cart.initializeCartAsync();
    Shopping.Api.cart.add({
        command: 'add',
        productId: designModeProduct.ProductId,
        productName: designModeProduct.Name,
        productMainImage: designModeProduct.Image,
        price: designModeProduct.Price,
        quantity: 1
    });
    
    var designModeSearch = { queryText: 'Men' };
}