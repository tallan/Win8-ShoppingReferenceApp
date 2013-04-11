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
    
    function totalItemPriceConverter(item) {
        return item.Price * item.Quantity;
    }

    WinJS.Namespace.define("Shopping.ViewModel", {
        TotalItemPriceConverter : WinJS.Binding.converter(totalItemPriceConverter),    

        CartViewModel : WinJS.Class.define(function CartViewModel_ctor() {

            this.username = '';

            this.customerId = "";
            this.appId = "";

            this.canSignout = false;

        }, {

            initAsync: function () {
                var self = this;

                var cart = Shopping.Api.cart;

                self.items = cart.items();
                self.subTotal = cart.subtotal();
                self.tax = cart.tax();
                self.shipping = cart.shipping();
                self.total = cart.total();
                if (cart.cart) {
                    self.HasAddresses = cart.cart.BillingAddress.Line1 && Shopping.Api.cart.cart.BillingAddress.Line1 != "";
                    self.HasPayment = cart.cart.PaymentInfo.CardType && Shopping.Api.cart.cart.PaymentInfo.CardType != "";
                    self.BillingAddress = cart.cart.BillingAddress;
                    self.ShippingAddress = cart.cart.ShippingAddress;
                    self.PaymentInfo = cart.cart.PaymentInfo;
                    self.SameAddresses = cart.cart.SameAddresses;
                }
                
                return WinJS.Promise.as(self);
            }

        })
    });
    
})(WinJS);