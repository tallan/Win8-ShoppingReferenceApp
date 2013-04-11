/*************************************************************************
*
*    Copyright (c) 2013 Tallan Inc.  All rights reserved. 
*
*    Use of this sample source code is subject to the terms of the Microsoft Limited Public License
*    at http://msdn.microsoft.com/en-us/cc300389.aspx#P and is provided AS-IS. 
*
*    For more information about Tallan, visit our website, http://tallan.com/.     
*
*    To see the topic that inspired this sample app, go to http://msdn.microsoft.com/en-us/library/windows/apps/jj635241. 
*
************************************************************************/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Shopping.WebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // find a better way to do these 2.
            config.Routes.MapHttpRoute(
                name: "VersionApi",
                routeTemplate: "api/{controller}/version",
                defaults: new { action = "GetVersion", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "CatalogApi",
                routeTemplate: "api/catalog",
                defaults: new { controller = "catalog", action = "Get", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
