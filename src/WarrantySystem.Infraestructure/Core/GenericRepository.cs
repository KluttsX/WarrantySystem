using System;
using System.Collections.Generic;
using System.Text;
using WarrantySystem.Domain.Core;
using WarrantySystem.Infraestructure.Context;

namespace WarrantySystem.Infraestructure.Core
{
    public class GenericRepository<T> where T : BaseEntity
    {
        private readonly ApplicationDbContext _context;

        public GenericRepository(ApplicationDbContext dataContext)
        {
            _context = dataContext;
        }

        public IEnumerable<T> GetAll()
        {
            var entity = _context.Set<T>().ToList();

            return entity;
        }

        public T GetById(int id)
        {
            var entity = _context.Set<T>()
                .FirstOrDefault(c => c.Id == id);

            return entity;
        }

        public int Create(T entity)
        {
            _context.Set<T>().Add(entity);

            return entity.Id;
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public void Delete(int id)
        {
            var entity = _context.Set<T>().FirstOrDefault(c => c.Id == id);

            _context.Set<T>().Remove(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }
    }
}
