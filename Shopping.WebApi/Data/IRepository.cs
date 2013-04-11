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

namespace ECommerce.WebApi.Data
{
    public interface IRepository<T>
    {
        List<T> GetAll();
        T Get(int id);
        T Get(Guid id);
        T Insert(T item);
        void Update(T item);
        bool Delete(T item);
    }
}