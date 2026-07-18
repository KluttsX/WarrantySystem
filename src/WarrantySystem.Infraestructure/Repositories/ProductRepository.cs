using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Context;

namespace WarrantySystem.Infraestructure.Repositories
{
    public class ProductRepository
    {
        private readonly ApplicationDbContext _context;
        public ProductRepository(ApplicationDbContext dataContext)
        {
            _context = dataContext;
        }

        public IEnumerable<Product> GetAll()
        {
            var _products = _context.Products.ToList();

            return _products;
        }

        public Product GetById(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            return product;
        }

        public int Create(Product product)
        {
            _context.Products.Add(product);

            return product.Id;
        }

        public void Update(int id, Product request)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            product.SerialNumber = request.SerialNumber;
            product.ClientId = request.ClientId;
            product.Brand = request.Brand;
            product.Model = request.Model;
            product.PurchaseDate = request.PurchaseDate;
            product.UpdatedDate = DateTime.UtcNow;

            _context.Products.Update(product);
        }

        public void Update(Product product)
        {
            _context.Products.Update(product);
        }

        public void Delete(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            _context.Products.Remove(product);
        }

        public void Delete(Product product)
        {
            _context.Products.Remove(product);
        }
    }
}
