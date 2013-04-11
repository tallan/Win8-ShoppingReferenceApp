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
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Shopping.WebApi
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}