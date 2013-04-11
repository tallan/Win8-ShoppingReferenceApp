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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ECommerce.WebApi.Controllers
{
    public class CartController : ApiController
    {
        private IRepository<Cart> _cartRepository;

        public CartController()
            : this(new CartRepository(new WebPathResolver()))
        {
        }

        public CartController(IRepository<Cart> cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public Cart Get(Guid id)
        {
            return _cartRepository.Get(id);
        }

        public Cart Put(Cart cart)
        {
            _cartRepository.Update(cart);
            return cart;
        }

        public Cart Post(Cart cart)
        {
            return _cartRepository.Insert(cart);
        }
    }
}
