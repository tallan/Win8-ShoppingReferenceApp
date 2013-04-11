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

namespace Shopping.Web.Models
{
    public class Catalog
    {
        public int version { get; set; }
        public string name { get; set; }
        public List<MiniProduct> products { get; set; }
    }

    public class MiniProduct
    {
        public int ProductId { get; set; }
        public string Area { get; set; }
        public string AreaImage { get; set; }
        public string AreaAppBarImage { get; set; }
        public string Category { get; set; }
        public string CategoryImage { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ThumbnailImage { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
        public double Rating { get; set; }
    }

    public class Product
    {
        public int ProductId { get; set; }
        public string Area { get; set; }
        public string AreaImage { get; set; }
        public string AreaAppBarImage { get; set; }
        public string Category { get; set; }
        public string CategoryImage { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
        public string XLargeImage { get; set; }
        public string LargeImage { get; set; }
        public string MediumImage { get; set; }
        public string ThumbnailImage { get; set; }
        public string IconImage { get; set; }
        public double Rating { get; set; }
        public int RatingCount { get; set; }
        public bool Featured { get; set; }
        public Review[] Reviews { get; set; }
    }

    public class Review
    {
        public string Author { get; set; }
        public string Title { get; set; }
        public string Comment { get; set; }
    }

    public class CartItem
    {
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string MainImage { get; set; }
        public string Name { get; set; }
        public string Size { get; set; }
        public string Color { get; set; }
    }

    public class Cart
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public string Email { get; set; }
        public CartItem[] Items { get; set; }
        public decimal Total { get; set; }
        public decimal Tax { get; set; }
        public bool SameAddresses { get; set; }
        public Address BillingAddress { get; set; }
        public Address ShippingAddress { get; set; }
        public PaymentInfo PaymentInfo { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as Cart;
            if (object.ReferenceEquals(other, null))
            {
                return false;
            }
            return Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }

    public class Address
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
    }

    public class PaymentInfo
    {
        public string CardType { get; set; }
        public string CardNumber { get; set; }
        public int ExpirationMonth { get; set; }
        public int ExpirationYear { get; set; }
        public int CvvCode { get; set; }
    }
}