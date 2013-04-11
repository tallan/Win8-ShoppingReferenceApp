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
using Shopping.Web.Models;

namespace ECommerce.WebApi.Data
{
    public class CartRepository : RepositoryBase<Cart>
    {
        private static List<Cart> _carts = new List<Cart>();

        public CartRepository(IPathResolver pathResolver)
            : base(pathResolver)
        {
        }

        public override Cart Get(Guid id)
        {
            return _carts.FirstOrDefault(c => c.Id == id);
        }

        public override Cart Insert(Cart item)
        {
            item.Id = Guid.NewGuid();
            item.Created = DateTime.Now;
            item.Items = item.Items ?? new CartItem[]{};
            item.BillingAddress = item.BillingAddress ?? new Address();
            item.ShippingAddress = item.ShippingAddress ?? new Address();
            item.PaymentInfo = item.PaymentInfo ?? new PaymentInfo();
            _carts.Add(item);
            return item;
        }

        public override void Update(Cart item)
        {
            _carts.Remove(item);
            _carts.Add(item);
        }

        public override bool Delete(Cart item)
        {
            return _carts.Remove(item);
        }
    }
}