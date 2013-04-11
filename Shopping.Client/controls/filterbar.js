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

    var utils = WinJS.Utilities;

    function _init(options) {
        
        utils.addClass(this.element, "filterarea");

        var ul = document.createElement("ul");
        utils.addClass(ul, "filterbar");
        this.element.appendChild(ul);

        var select = document.createElement("select");
        utils.addClass(select, "filterselect");
        this.element.appendChild(select);
    }

    function _applyFilter(filter, originalResults) {
        if (filter.results === null) {
            filter.results = originalResults.createFiltered(filter.predicate);
        }
        return filter.results;
    }

    function _filterChanged(itemIndex, filterIndex) {
        var filterBar = this.element.querySelector(".filterbar");
                
        utils.removeClass(filterBar.querySelector(".highlight"), "highlight");
        utils.addClass(filterBar.childNodes[itemIndex], "highlight");

        this.element.querySelector(".filterselect").selectedIndex = filterIndex;

        _fireFilterChangedEvent(this.element, this.filters[filterIndex].results.dataSource, filterIndex);
    }

    function _fireFilterChangedEvent(element, results, filterIndex) {
        var filterChangedEvent = document.createEvent("CustomEvent");

        filterChangedEvent.initCustomEvent("filterchanged", true, true, {
            index: filterIndex,
            results: results
        });
        
        var prevented = !element.dispatchEvent(filterChangedEvent);
        return {
            prevented: prevented
        };
    }
    
    function populate(originalResults) {
        /// <summary>
        /// Populates the filter lists with the approriate text and counts based on the full data supplied.
        /// </summary>
        
        var filterBar = this.element.querySelector(".filterbar");
        var li, option, filterIndex, itemIndex;

        filterBar.innerHTML = "";
        itemIndex = 0;
        for (filterIndex = 0; filterIndex < this.filters.length; filterIndex++) {
            this._applyFilter(this.filters[filterIndex], originalResults);

            var filterItemCount = this.filters[filterIndex].results.length;
            if (this.includeEmpty || filterItemCount > 0) {

                li = document.createElement("li");
                li.filterIndex = filterIndex;
                li.itemIndex = itemIndex;
                li.tabIndex = 0;
                li.textContent = this.filters[filterIndex].text + " (" + filterItemCount + ")";
                li.onclick = function (args) { this._filterChanged(args.target.itemIndex, args.target.filterIndex); }.bind(this);
                li.onkeyup = function (args) {
                    if (args.key === "Enter" || args.key === "Spacebar")
                        this._filterChanged(args.target.itemIndex, args.target.filterIndex);
                }.bind(this);
                utils.addClass(li, "win-type-interactive");
                utils.addClass(li, "win-type-x-large");
                filterBar.appendChild(li);

                if (itemIndex === 0) {
                    utils.addClass(li, "highlight");
                }
                itemIndex++;

                option = document.createElement("option");
                option.value = itemIndex + '|' + filterIndex;
                option.textContent = this.filters[filterIndex].text + " (" + filterItemCount + ")";
                this.element.querySelector(".filterselect").appendChild(option);
            }
        }

        this.element.querySelector(".filterselect").onchange = function (args) {
            var vals = args.currentTarget.value.split('|');
            this._filterChanged(+vals[0], +vals[1]);
        }.bind(this);
    }
    
    WinJS.Namespace.define("Shopping.Controls", {
        FilterBar: WinJS.Class.define(function FilterBar_ctor(element, options) {

            this.options = options || {};
            this.element = element;
            this.filters = [];
            WinJS.UI.setOptions(this, options);
            this._init();

        }, {
            includeEmpty: {
                get: function () {
                    return this.options.includeEmpty;
                },
                set: function (include) {
                    this.options.includeEmpty = include;
                }
            },

            _init: _init,

            // This function filters the search data using the specified filter.
            _applyFilter: _applyFilter,

            // This function responds to a user selecting a new filter. It updates the
            // selection list and the displayed results.
            _filterChanged: _filterChanged,

            // This function generates the filter selection list.
            populate: populate,

            // hides the filterbar permanently
            hide: function () {
                this.element.style.display = "none";
            },

            select: function (index) {
                this._filterChanged(index);
            },
            
            clearSelection: function () {
                var filterBar = this.element.querySelector(".filterbar");
                
                if (filterBar != null) {
                    utils.removeClass(filterBar.querySelector(".highlight"), "highlight");
                    utils.addClass(filterBar.childNodes[0], "highlight");
                }
            }
        })
    
    });

    WinJS.Class.mix(Shopping.Controls.FilterBar, WinJS.Utilities.createEventProperties("filterchanged"));
    WinJS.Class.mix(Shopping.Controls.FilterBar, WinJS.UI.DOMEventMixin);
})();