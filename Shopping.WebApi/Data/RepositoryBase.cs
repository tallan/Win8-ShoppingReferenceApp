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
using System.IO;

namespace ECommerce.WebApi.Data
{
    public class RepositoryBase<T> : IRepository<T>
    {
        private readonly IPathResolver _pathResolver;
        public RepositoryBase(IPathResolver pathResolver)
        {
            _pathResolver = pathResolver;
        }

        public virtual List<T> GetAll()
        {
            throw new NotImplementedException();
        }

        public virtual T Get(int id)
        {
            throw new NotImplementedException();
        }

        public virtual T Get(Guid id)
        {
            throw new NotImplementedException();
        }

        public virtual T Insert(T item)
        {
            throw new NotImplementedException();
        }

        public virtual void Update(T item)
        {
            throw new NotImplementedException();
        }

        public virtual bool Delete(T item)
        {
            throw new NotImplementedException();
        }

        protected TJson LoadJson<TJson>(string path)
        {
            var jsonFile = _pathResolver.GetPath(path);
            var json = default(string);
            using (StreamReader reader = new StreamReader(jsonFile))
            {
                json = reader.ReadToEnd();
            }

            return Newtonsoft.Json.JsonConvert.DeserializeObject<TJson>(json);
        }
    }
}