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
/// <reference path="/js/services.js" />
/// <reference path="/js/offline_services.js" />

(function (app, onlineServices, offlineServices) {
    "use strict";
    var _cachedProductDetails = [];
	
    function services() {
        /// <summary>
        /// This is an late binding abstraction over the services to support offline mode and online mode.
        /// With the exception of design mode support this abstraction primarily exists for the purpose of the demo app.
        /// </summary>
		if (Windows.ApplicationModel.DesignMode.designModeEnabled) {
			return offlineServices;
		}
		if (Shopping.Api.settings.useOffline)
		{
			return offlineServices;
		}
		return onlineServices;
	}

    var Catalog = WinJS.Class.define(function Catalog_ctor(catalogModel) {
        /// <summary>
        /// The constructor for a new Catalog object.  This app contains a single
        /// catalog which is loaded via the complex business logic in Shopping.Api.loadCatalogAsync
        /// </summary>
        catalogModel = catalogModel || { products: [] };
        this.catalog = catalogModel;
        this.products = catalogModel.products;
    }, {
        getAreas: function () {
            /// <summary>
            /// Gets the areas by getting a distinct list of areas from all products in the catalog.
            /// </summary>
            var areaGroups = _.groupBy(this.products, function (p) { return p.Area });
            return _.map(areaGroups, function(v, k) {
                return {
                    area: k,
                    featuredProducts: _.take(v, 4),
                    mainImage: v[0].AreaImage,
                    appBarImage: v[0].AreaAppBarImage,
                    itemCount: v.length
                };
            });
        },
        getCategories: function () {
            /// <summary>
            /// Gets the categories by getting a distinct list of categories from all products in the catalog.
            /// </summary>
            var areaGroups = _.groupBy(this.products, function (p) { return p.Category });
            return _.map(areaGroups, function (v, k) { return { category: k }; });
        },
        getProductsForArea: function (area) {
            /// <summary>
            /// Gets a list of products that match the specified filter.
            /// </summary>
            return _.filter(this.products, function (v, k) { return v.Area == area; });
        },
        getProductCountForCategory: function (category) {
            /// <summary>
            /// Gets the count of products that match the specified category
            /// </summary>
            return _.filter(this.products, function (v, k) {
                return v.Category == category;
            }).length;
        },
        search: function (queryText) {
            /// <summary>
            /// Gets a list of products that match the specified queryText
            /// </summary>
            queryText = queryText.toUpperCase();
            return _.filter(this.products, function (p) {
                return p.Name.toUpperCase().indexOf(queryText) !== -1;
            });
        },
        getProductById: function (id) {
            /// <summary>
            /// Gets the full product details for the product with the specified id
            /// </summary>
            return _.find(this.products, function(p) {
                return p.ProductId == id;
            });
        },
        getCategoriesAsFilters: function () {
            /// <summary>
            /// Gets the categories as a list of filter objects, which contain predicate functions to resolve the matching products
            /// </summary>
            var filters = [];
            filters.push({ results: null, text: "All", predicate: function (product) { return true; } });

            _.each(this.getCategories(), function (c) {
                filters.push({ results: null, text: c.category, predicate: function (product) { return product.Category === c.category; } });
            });
            return filters;
        },
        getRatingsAsFilters: function () {
            /// <summary>
            /// Gets the ratings as a list of filter objects, which contain predicate functions to resolve the matching products
            /// </summary>
            var filters = [];
            filters.push({ results: null, text: "All", predicate: function (product) { return true; } });
            
            var filterForRange = function (rating) {
                return {
                    results: null,
                    text: rating == 1 ? rating + " star" : rating + " stars",
                    predicate: function (product) {
                        return product.Rating >= rating && product.Rating < rating + 1;
                    }
                };
            };

            filters.push(filterForRange(1));
            filters.push(filterForRange(2));
            filters.push(filterForRange(3));
            filters.push(filterForRange(4));
            filters.push(filterForRange(5));

            return filters;
        },
        getPricesAsFilters: function () {
            /// <summary>
            /// Gets the prices as a list of filter objects, which contain predicate functions to resolve the matching products
            /// </summary>
            var filters = [];
            filters.push({ results: null, text: "All", predicate: function (product) { return true; } });

            var filterForRange = function(min, max) {
                var label = max ? "$" + min + " - $" + max : "$" + min + "+";

                return {
                    results: null,
                    text: label,
                    predicate: function(product) {
                        return product.Price > min && product.Price <= max;
                    }
                };
            };

            filters.push(filterForRange(0, 50));
            filters.push(filterForRange(50, 100));
            filters.push(filterForRange(100, 200));
            filters.push(filterForRange(200, 300));
            filters.push(filterForRange(300, 500));
            filters.push(filterForRange(500));

            return filters;
        }
    });

    var Cart = WinJS.Class.define(function Cart_ctor(cart) {
        /// <summary>
        /// Creates a new Cart data model.  This is an abstraction of the JSON object thats returned to/from the services.
        /// </summary>
        this.cart = cart;
    }, {
        items: function () {
            /// <summary>
            /// Gets the list of items in the current cart or an empty array.
            /// </summary>
            return this.cart ? this.cart.Items : [];
        },
        subtotal: function () {
            /// <summary>
            /// Gets the current subtotal of all items in the current cart.
            /// </summary>
            var total = 0;
            _.each(this.items(), function (i) {
                total += (i.Price * i.Quantity);
            });
            return total;
        },
        tax: function () {
            /// <summary>
            /// Gets the current tax for the cart which for demo purposes is hard coded to a fixed tax rate of 7.5%
            /// </summary>
            var tax = this.subtotal() * 0.075;
            return Math.round(tax * 100) / 100;
        },
        shipping: function() {
            /// <summary>
            /// Gets the current shipping for the cart which for demo purposes is hard coded to $10.00
            /// </summary>
            return this.subtotal() == 0 ? 0 : 10;
        },
        total: function () {
            /// <summary>
            /// Gets the total price for the cart
            /// </summary>
            return this.subtotal() + this.tax() + this.shipping();
        },
        initializeCartAsync: function () {
            /// <summary>
            /// Initialize the shopping cart to the new cart created from the webservices.  This is how the cart gets an id
            /// to be used for storing in Windows8 Remote Storage.
            /// </summary>
            var self = this;

            return services().createCartAsync().then(function(c) {
                Shopping.Api.settings.cartId = c.Id;
                self.cart = c;
                return c;
            });
        },
        submitOrder: function () {
            /// <summary>
            /// Submit the cart order and clear the cart after processing.  This is where
            /// companies could place any custom logic required for order processing.  It is
            /// recommended that any sensitive information and business logic should exists on
            /// the service side of your application.
            /// </summary>
            
            // call services().updateCartAsync or services().submitCartAsOrderAsync
            Shopping.Api.settings.cartId = null;
            this.cart = null;
        },
        processCommandAsync: function (command) {
            /// <summary>
            /// The cart uses a commanding mechanism to process modifications.  This is the central location for processing any commands.
            /// This mechanism could serve useful if an app wanted to adapt the code to support offline cart modifications.  This method
            /// could be changed to support caching commands and processing them when the applications regains a connection.  Commands
            /// contain a type property which coorelates to a method on this cart.  To add new types just add an equivalent method and
            /// it will automatically get processed.
            /// </summary>
            
            var self = this;

            // in order to apply a command just execute the function with the same name as the action of the command.
            var applyCommand = function (cart) {
                var actionFunction = self[command.action];
                if (typeof actionFunction === 'function') {
                    self[command.action](command);
                }
            };
            
            if (this.cart) {
                // if a cart already exists, just apply the command and then update it.
                applyCommand(this.cart);
                return services().updateCartAsync(this.cart);
            }
            else {
                // if there is no cart, then create a new one and then apply the command
                return this.initializeCartAsync().then(function (c) {
                    applyCommand(c);
                    return services().updateCartAsync(c);
                });
            }
        },
        add: function (command) {
            /// <summary>
            /// Handles the 'add' type of command.  See processCommandAsync.
            /// </summary>
            var existing = _.find(this.cart.Items, function (i) {
                return i.ProductId === command.productId
                    && i.Color == command.color
                    && i.Size == command.size
            });

            if (existing) {
                existing.Quantity += command.quantity;
            }
            else {
                this.cart.Items.push({
                    ProductId: command.productId,
                    Name: command.productName,
                    MainImage: command.productMainImage,
                    Price: command.price,
                    Quantity: command.quantity,
                    Size: command.size,
                    Color: command.color
                });

                Shopping.Api.eventAggregator.publish({
                    type: Shopping.Api.eventAggregator.type.AddedToCart,
                    productId: command.productId
                });
            }
        },
        updateQuantity: function (command) {
            /// <summary>
            /// Handles the 'updateQuantity' type of command.  See processCommandAsync.
            /// </summary>
            command.item.Quantity = command.newQuantity;

            return services().updateCartAsync(this.cart);
        },
        remove: function (command) {
            /// <summary>
            /// Handles the 'remove' type of command.  See processCommandAsync.
            /// </summary>
            
            if (this.cart.Items.length == 1) {
                this.cart.Items = [];
            }
            else {
                this.cart.Items.splice(command.index, 1);
            }
            
            return services().updateCartAsync(this.cart);
        }
    });

    var EventAggregator = WinJS.Class.define(function () {
        /// <summary>
        /// Creates a new EventAggregator for use as a global pub/sub mechanism throughout the app.
        /// </summary>
        this._registeredCallbacks = [];
        this._type = {
            AddedToCart: 'AddedToCart',
            Navigated: 'Navigated'
        };
    }, {
        type: {
            get: function() { return this._type; }
        },
        publish: function (details) {
            /// <summary>
            /// Publishes an event with the specified details to all subscribers
            /// </summary>
            _.each(this._registeredCallbacks, function (subscriber) {
                subscriber(details);
            });
        },
        subscribe: function (callback) {
            /// <summary>
            /// Subscribes the specified callback to receive notification of all published messages.
            /// </summary>
            if (typeof callback !== 'function') {
                throw new Error('Unable to subscribe to eventAggregator notification because the supplied callback is not a function.');
            }
            this._registeredCallbacks.push(callback);
        },
        unsubscribe: function (callback) {
            /// <summary>
            /// Unsubscribes the specified callback from receiving further messages.
            /// </summary>
            var idx = this._registeredCallbacks.indexOf(callback);
            if (idx != -1) this._registeredCallbacks.splice(idx, 1);
        }
    });

    var Settings = WinJS.Class.define(function () { }, {
        useOffline: {
            get: function () { return this.getRoaming('useOffline'); },
            set: function (v) { this.setRoaming('useOffline', v); }
        },
        cartId: {
            get: function () { return this.getRoaming('cartId'); },
            set: function (v) { this.setRoaming('cartId', v); }
        },
        getRoaming: function (key) {
            /// <summary>
            /// Gets the current roaming value for a specified key.
            /// </summary>
            return Windows.Storage.ApplicationData.current.roamingSettings.values[key];
        },
        setRoaming: function (key, value) {
            /// <summary>
            /// Sets the current roaming key to the specified value.
            /// </summary>
            Windows.Storage.ApplicationData.current.roamingSettings.values[key] = value;
        }
    });

    function loadCatalogAsync() {
        /// <summary>
        /// This operation loads the saved catalog.  The catalog is cached in the application
        /// the method checks the version of the catalog and updates it if its old.  If the
        /// catalog has not been downloaded it will download it.
        /// </summary>
        var self = this;
        var completed;
        var error;
        var promise = new WinJS.Promise(function (c, e) { completed = c; error = e; });
            
        var catalog = app.sessionState.catalog;
        var err = function (e) {
            if (catalog == null) {
                error(e);
            }
            // Use app storage version
            completed(new Catalog(catalog));
        };
        if (catalog) {
            services().getCatalogVersionAsync().then(function (v) {
                if (v !== catalog.version) {
                    services().getCatalogAsync().then(function (cat) {
                        completed(new Catalog(cat));
                    }, err);
                }
                else {
                    completed(new Catalog(catalog));
                }
            }, err);
        }
        else {
            services().getCatalogAsync().then(function (cat) {
                completed(new Catalog(cat));
            }, err);
        }

        return promise.then(function (cat) {
            // catalog is loaded, cache it before 
            self.catalog = cat;
            app.sessionState.catalog = cat.catalog;
            return cat;
        });
    }

    function loadCartAsync(id) {
        /// <summary>
        /// Gets a previously saved cart for the specified id.
        /// </summary>
        return services().getCartAsync(id).then(function (cart) {
            if (cart != null) {
                Shopping.Api.cart = new Cart(cart);
            }
        });
    }

    function getProductAsync(id) {
        /// <summary>
        /// Gets a product matching the specified id from cache if it exists otherwise it retrieves it from
        /// the webservice and then loads it into the cache for the future.
        /// </summary>
        
        var product = _.find(_cachedProductDetails, function (p) { return p.ProductId === id });
        if (product)
        {
            return WinJS.Promise.as(product);
        }
            
        // load from web service and add to cache
        return services().getProductAsync(id).then(function (p) {
            _cachedProductDetails.push(p);
            return p;
        });
    }

    WinJS.Namespace.define("Shopping.Api", {
        catalog: null, // initialized via loading the catalog
        cart: new Cart(),
        eventAggregator: new EventAggregator(),
        settings: new Settings(),

        loadCatalogAsync: loadCatalogAsync,
        loadCartAsync: loadCartAsync,
        getProductAsync: getProductAsync
    });

})(WinJS.Application, Shopping.Services, Shopping.Services.Offline);