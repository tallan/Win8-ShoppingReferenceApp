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


// For an introduction to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446

(function (WinJS) {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    
    var splash = null; // Variable to hold the splash screen object.
    var activationDetails = 0;

    function loaded() {
        /// <summary>
        /// The loaded event fires once when an application loads.   This is different from the activated event which may fire multiple times
        /// after the app has already loaded.
        /// </summary>

        // Setup listener for Search charm
        var searchPane = Windows.ApplicationModel.Search.SearchPane.getForCurrentView();
        searchPane.addEventListener("querysubmitted", search, false);

        // Setup Tile updater
        var tileUpdater = new Shopping.TileUpdater();
        Shopping.Api.eventAggregator.subscribe(tileUpdater.eventPublished);
        
        // Sharing in the application is context sensitive per page.  The Sharing provider uses the EventAggregator to
        // listen to navigation events and change the sharing context at any given time.
        var sharingProvider = new Shopping.SharingProvider();
        Shopping.Api.eventAggregator.subscribe(function (args) {
            sharingProvider.eventPublished(args);
        });

        // Setup Settings charm
        initializeSettings();
        
        WinJS.Binding.optimizeBindingReferences = true;
    }

    function search(args) {
        /// <summary>
        /// Event handler for the search charm querySubmitted event.
        /// </summary>
        
        return nav.navigate('pages/search/search.html', { queryText: args.queryText });
    }

    function activated(args) {
        /// <summary>
        /// The activated event fires when the app is launched.   This can occur when the tile is clicked from the start screen, secondary tiles, or from searching.
        /// </summary>

        activationDetails = args.detail;
        if (activationDetails.kind === activation.ActivationKind.launch || activationDetails.kind === activation.ActivationKind.search) {
            // Retrieve splash screen object
            splash = activationDetails.splashScreen;

            // Register an event handler to be executed when the splash screen has been dismissed.
            splash.addEventListener("dismissed", loadCart, false);

            // Create and display the extended splash screen using the splash screen object.
            ExtendedSplash.show(splash);
            
            args.setPromise(WinJS.UI.processAll());
        }
    }

    function loadCart() {
        /// <summary>
        /// Responds to the splash screen dismissed event and kicks off a promise chain starting with loading an cart
        /// if an id exists, and kicks off the next promise for loading the catalog.
        /// </summary>

        var cartId = Shopping.Api.settings.cartId;
        if (cartId != null) {
            // using loadCatalog for the return and error, if there is an error we are ignoring it and loading the cart anyways.
            Shopping.Api.loadCartAsync(cartId).then(loadCatalog, loadCatalog);
        } else {
            loadCatalog();
        }
    }

    function loadCatalog() {
        /// <summary>
        /// Kicks off a promise to load the catalog for the application followed by catalogReady method if successful or the
        /// or the catalogError method which shows the NoInternet splash screen.
        /// </summary>
        
        Shopping.Api.loadCatalogAsync().then(catalogReady, catalogError);
    }

    function catalogError(err) {
        /// <summary>
        /// Responds to errors when loading the catalog and shows a NoInternet available screen with a retry button.
        /// </summary>
        
        ExtendedSplash.remove();

        NoInternet.show(catalogReload);
    }

    function catalogReload() {
        /// <summary>
        /// The event handler for the NoInternet screen's retry button.  This method removes the NoInternet screen and retrys
        /// app initialization promise chain.
        /// </summary>

        NoInternet.remove();

        ExtendedSplash.show(splash);

        loadCart();
    }

    function catalogReady(catalog) {
        /// <summary>
        /// Used to respond to successful completion of the Shopping.Api.loadCatalogAsync promise.
        /// This method sets up the remainder of the application.
        /// </summary>

        ExtendedSplash.remove();
        initializeAppBar();

        // loads saved navigation if present
        if (app.sessionState.history) {
            nav.history = app.sessionState.history;
        }
        // given the history above loaded then a location would be set so navigate to it.
        if (nav.location) {
            nav.history.current.initialPlaceholder = true;
            nav.navigate(nav.location, nav.state);
        } else {
            nav.navigate(Application.navigator.home);
        }

        // In the event that the app was launced via search then the args are rerouted to the eventhandler to the
        // of the search charm querySubmitted event.
        if (activationDetails.kind === activation.ActivationKind.search) {
            search(activationDetails);
        }
    }

    function initializeSettings() {
        /// <summary>
        /// Initalized any commands in the settings charm.
        /// </summary>
        
        WinJS.Application.onsettings = function (e) {
            e.detail.applicationcommands = { "settings": { title: "Settings", href: "/pages/settings/settings-flyout.html" } };
            WinJS.UI.SettingsFlyout.populateSettings(e);
        };

        document.getElementById("settingsLink").addEventListener('click', function (args) {
            WinJS.UI.SettingsFlyout.showSettings("settings", "/pages/settings/settings-flyout.html");

            args.preventDefault();
        }, false);
    }

    function initializeAppBar() {
        /// <summary>
        /// Initialized the top AppBar with the list of areas available from the catalog.  Since these areas are dynamic this is done in javascript
        /// rather than in HTML.
        /// </summary>
        
        var topAppBarEl = document.getElementById('topAppBar');
        var topAppBar = topAppBarEl.winControl;
        var commands = [];

        var cartEl = document.createElement("button");
        var cart = new WinJS.UI.AppBarCommand(cartEl, { id: 'CartBtn', label: 'Cart' });
        cart.addEventListener('click', function() {
            nav.navigate('/pages/cart/cart.html');
        });
        commands.push(cart);

        // create a eventAggregator event listener to update the cart label on the appbar
        var updateCartLabelCallback = function (e) {
            if (e.type == Shopping.Api.eventAggregator.type.AddedToCart) {
                cart.label = "Cart (" + Shopping.Api.cart.items().length + ")";
            }
        };
        Shopping.Api.eventAggregator.subscribe(updateCartLabelCallback);
        
        // create command for Home
        var homeEl = document.createElement("button");
        var home = new WinJS.UI.AppBarCommand(homeEl, { label: 'Home', section: 'selection' });
        home.addEventListener('click', function () {
            nav.navigate('/pages/home/home.html');
        });
        commands.push(home);

        // create commands for each Area
        _.each(Shopping.Api.catalog.getAreas(), function(i) {
            var el = document.createElement("button");
            el.style.backgroundImage = "url(" + i.appBarImage + ")";
            var cmd = new WinJS.UI.AppBarCommand(el, { label: i.area, section: 'selection' });
            cmd.addEventListener('click', function () {
                nav.navigate('/pages/categories/categories.html', { item: i.area });
            });
            commands.push(cmd);
        });
        
        topAppBar.commands = commands;
        topAppBar.disabled = false;
    }

    function suspending(args) {
        /// <summary>
        /// Used when the app is suspending.  This is the last chance to save any information such as navigation that would need to be saved in the 
        /// event that the app may be terminated.
        /// </summary>
        app.sessionState.history = nav.history;
    };

    function resuming() {
        /// <summary>
        /// Use this method to load any information when the app is resuming.  This will happen if the app has not yet been suspended, but was not terminated.
        /// </summary>
    };

    function navigated(e) {
        /// <summary>
        /// An event handler for the navigation event.  This handler is used to route navigation events through the Shopping.Api.EventAggregator.
        /// </summary>
        Shopping.Api.eventAggregator.publish({
            type: Shopping.Api.eventAggregator.type.Navigated,
            location: e.detail.location,
            state: e.detail.state
        });
    }

    app.addEventListener("loaded", loaded, false);
    app.addEventListener("activated", activated, false);
    Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", resuming, false);
    app.addEventListener("checkpoint", suspending, false);
    nav.addEventListener("navigated", navigated, false);
    app.start();
})(WinJS);
