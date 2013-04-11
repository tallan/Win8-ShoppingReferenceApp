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

using ECommerce.WebApi.Data;
using Shopping.Web.Models;
using System.Web.Http;

namespace Shopping.Web.Controllers
{
    public class CatalogController : ApiController
    {
        private readonly IRepository<Catalog> _catalogRepository;

        public CatalogController()
            : this(new CatalogRepository(new WebPathResolver()))
        {
        }

        public CatalogController(IRepository<Catalog> catalogRepository)
        {
            _catalogRepository = catalogRepository;
        }

        public int GetVersion()
        {
            return 1;
        }

        public Catalog Get()
        {
            //System.Threading.Tasks.Task.Delay(2000).Wait();

            return _catalogRepository.Get(0);
        }
    }
}
