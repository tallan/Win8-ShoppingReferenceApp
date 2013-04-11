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

    function LiteralLayout() {
        /// <summary>
        /// This is the default layout for the SimpleList, this could be used when the template
        /// was a <li> or <div> that just needed to simply be added.
        /// </summary>
        return {
            layout : function() {}
        };
    }

    function GridLayout(element) {
        /// <summary>
        /// This is a more advanced grid layout uses the available container height to wrap
        /// items from top to bottom then left to right.
        /// </summary>
        var containerHeight;
        
        var currentColumn = 1;
        var currentRow = 1;
        var currentColumnHeight = 0;
        var margin = 40;

        function layout(item) {
            containerHeight = element.offsetHeight - margin;

            var itemHeight = item.offsetHeight + margin;
            var newColumnHeight = currentColumnHeight + itemHeight;
            if (newColumnHeight > containerHeight) {
                currentColumn++;
                currentRow = 1;
                currentColumnHeight = itemHeight;
            } else {
                currentColumnHeight = newColumnHeight;
            }
            item.style['-ms-grid-column'] = currentColumn;
            item.style['-ms-grid-row'] = currentRow++;
        }

        return {
            layout : layout
        };
    }

    

    function _refresh() {
        /// <summary>
        /// Refreshes the view by emptying the container element and populating it with newly
        /// rendered versions of the items.
        /// </summary>
        var element = this.element;
        var layoutManager = this.options.layoutManager || _createLayoutManager(this);
        element.innerHTML = "";
        
        var templateControl = this.options.itemTemplate.winControl;
        
        for (var d in this._dataSource) {
            var data = this._dataSource[d];
            templateControl.render(data)
                    .done(function (item) {
                        if (item.children.length != 1) {
                            throw "template for the SimpleList can only contain one child element.";
                        }
                        var child = item.children[0];
                        element.appendChild(child);
                        layoutManager.layout(child, data);
                    });
        }
    }

    function _createLayoutManager(list) {
        if (list.options.layout === 'grid')
            return new GridLayout(list.element);
        return new LiteralLayout();
    }

    WinJS.Namespace.define("Shopping.Controls", {
        SimpleList: WinJS.Class.define(function SimpleList_ctor(element, options) {

            this.options = options || {};
            this.element = element;
            WinJS.UI.setOptions(this, this.options);

        }, {
            itemDataSource: {
                get: function () {
                    return this._dataSource;
                },
                set: function (newData) {
                    this._dataSource = newData || [];
                    
                    this._refresh();
                }
            },

            itemTemplate: {
                get: function () {
                    return this.options.itemTemplate;
                },
                set: function (newTemplate) {
                    this.options.itemTemplate = newTemplate;
                }
            },

            layoutManager: {
                get: function () {
                    return this.options.layoutManager;
                },
                set: function (newTemplate) {
                    this.options.layoutManager = newTemplate;
                }
            },

            _refresh: _refresh,
        })

    });
})();
