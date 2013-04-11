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


(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var nav = WinJS.Navigation;

    WinJS.Namespace.define("Application", {
        PageControlNavigator: WinJS.Class.define(
            // Define the constructor function for the PageControlNavigator.
            function PageControlNavigator(element, options) {
                this._element = element || document.createElement("div");
                this._element.appendChild(this._createPageElement());

                this.home = options.home;
                this._lastViewstate = appView.value;

                nav.onnavigated = this._navigated.bind(this);
                window.onresize = this._resized.bind(this);

                document.body.onkeyup = this._keyupHandler.bind(this);
                document.body.onkeypress = this._keypressHandler.bind(this);
                document.body.onmspointerup = this._mspointerupHandler.bind(this);

                Application.navigator = this;
            }, {
                home: "",
                /// <field domElement="true" />
                _element: null,
                _lastNavigationPromise: WinJS.Promise.as(),
                _lastViewstate: 0,

                // This is the currently loaded Page object.
                pageControl: {
                    get: function () { return this.pageElement && this.pageElement.winControl; }
                },

                // This is the root element of the current page.
                pageElement: {
                    get: function () { return this._element.firstElementChild; }
                },

                // Creates a container for a new page to be loaded into.
                _createPageElement: function () {
                    var element = document.createElement("div");
                    element.style.width = "100%";
                    element.style.height = "100%";
                    return element;
                },

                // Retrieves a list of animation elements for the current page.
                // If the page does not define a list, animate the entire page.
                _getAnimationElements: function () {
                    if (this.pageControl && this.pageControl.getAnimationElements) {
                        return this.pageControl.getAnimationElements();
                    }
                    return this.pageElement;
                },

                // Navigates back whenever the backspace key is pressed and
                // not captured by an input field.
                _keypressHandler: function (args) {
                    if (args.key === "Backspace") {
                        nav.back();
                    }
                },

                // Navigates back or forward when alt + left or alt + right
                // key combinations are pressed.
                _keyupHandler: function (args) {
                    if ((args.key === "Left" && args.altKey) || (args.key === "BrowserBack")) {
                        nav.back();
                    } else if ((args.key === "Right" && args.altKey) || (args.key === "BrowserForward")) {
                        nav.forward();
                    }
                },

                // This function responds to clicks to enable navigation using
                // back and forward mouse buttons.
                _mspointerupHandler: function (args) {
                    if (args.button === 3) {
                        nav.back();
                    } else if (args.button === 4) {
                        nav.forward();
                    }
                },

                // Responds to navigation by adding new pages to the DOM.
                _navigated: function (args) {
                    var newElement = this._createPageElement();
                    var parentedComplete;
                    var parented = new WinJS.Promise(function (c) { parentedComplete = c; });

                    this._lastNavigationPromise.cancel();

                    this._lastNavigationPromise = WinJS.Promise.timeout().then(function () {
                        return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
                    }).then(function parentElement(control) {
                        var oldElement = this.pageElement;
                        if (oldElement.winControl && oldElement.winControl.unload) {
                            oldElement.winControl.unload();
                        }
                        this._element.appendChild(newElement);
                        this._element.removeChild(oldElement);
                        oldElement.innerText = "";
                        this._updateBackButton();
                        this._overrideLinkHandlers(newElement);
                        this._disableImageDragging(newElement);
                        this._rerouteClickEatersInsideViewBox(newElement);
                        parentedComplete();
                        WinJS.UI.Animation.enterPage(this._getAnimationElements())
                            .then(this._refocusDocument).done();
                    }.bind(this));

                    args.detail.setPromise(this._lastNavigationPromise);
                },

                // Responds to resize events and call the updateLayout function
                // on the currently loaded page.
                _resized: function (args) {
                    if (this.pageControl && this.pageControl.updateLayout) {
                        this.pageControl.updateLayout.call(this.pageControl, this.pageElement, appView.value, this._lastViewstate);
                    }
                    this._lastViewstate = appView.value;
                },

                // Updates the back button state. Called after navigation has
                // completed.
                _refocusDocument: function () {
                    document.body.focus();
                },

                // Updates the back button state. Called after navigation has
                // completed.
                _updateBackButton: function () {
                    var backButton = this.pageElement.querySelector("#backButton");
                    if (backButton) {
                        backButton.onclick = function () { nav.back(); };

                        if (nav.canGoBack) {
                            backButton.removeAttribute("disabled");
                        } else {
                            backButton.setAttribute("disabled", "disabled");
                        }
                    }
                },
                // Updates the links to use the navigation framework.
                _overrideLinkHandlers: function (element) {
                    var linkInvoked = function (args) {
                        var state = args.currentTarget.getAttribute('data-state');
                        nav.navigate(args.currentTarget.href, state);

                        args.preventDefault();
                    };
                    var links = element.querySelectorAll('a');
                    for (var i = 0; i < links.length; i++) {
                        links[i].addEventListener('click', linkInvoked);
                    }
                },
                // Updates the links to use the navigation framework.
                _disableImageDragging: function (element) {
                    var dragStarted = function (args) {
                        args.preventDefault();
                        return false;
                    };
                    var images = element.querySelectorAll('img');
                    for (var i = 0; i < images.length; i++) {
                        images[i].addEventListener('dragstart', dragStarted);
                    }
                },

                // This is to resolve a styling conflict with z-index stacks after scaling the ViewBox
                _rerouteClickEatersInsideViewBox: function (element) {
                   
                    var eaters = WinJS.Utilities.query('.win-appbarclickeater, .win-flyoutmenuclickeater');
                    eaters.forEach(function(eater) {
                            var container = WinJS.Utilities.query('.pagecontainer')[0];
                            if (eater.parentElement === document.body) {
                                document.body.removeChild(eater);
                                container.appendChild(eater);
                            }
                    });
                }
            }
        )
    });
})();
