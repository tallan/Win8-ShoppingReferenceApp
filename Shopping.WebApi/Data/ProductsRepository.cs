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
    public class ProductsRepository : RepositoryBase<Product>
    {
        private List<Product> _cachedProducts;

        public ProductsRepository(IPathResolver pathResolver)
            : base(pathResolver)
        {
        }

        public override List<Product> GetAll()
        {
            if (_cachedProducts == null)
            {
                var products = LoadJson<List<Product>>("SampleData\\products.json");

                products = PopulateReviews(products);

                _cachedProducts = products;
            }
            return _cachedProducts;
        }

        public override Product Get(int id)
        {
            return GetAll().FirstOrDefault(p => p.ProductId == id);
        }

        private static List<Product> PopulateReviews(List<Product> products)
        {
            var rand = new Random();
            foreach (var p in products)
            {
                p.Reviews = Enumerable.Range(0, 14).Select(i => new Review() { Author = "unknown", Title = "Review " + i + 1, Comment = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiumod tempor." }).ToArray();
                p.RatingCount = rand.Next(1, 130);
            }
            return products;
        }
    }
}