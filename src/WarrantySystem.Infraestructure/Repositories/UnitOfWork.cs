using System;
using System.Collections.Generic;
using System.Text;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Core;
using WarrantySystem.Infraestructure.Context;

namespace WarrantySystem.Infraestructure.Repositories
{
    public class UnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context, 
            ClaimRepository claimRepository,
            ClientRepository clientRepository,
            ProductRepository productRepository,
            GenericRepository<Warranty> warrantyRepository)
        {
            _context = context;
            Claim = claimRepository;
            Client = clientRepository;
            Product = productRepository;
            Warranty = warrantyRepository;
        }

        public ClaimRepository Claim { get; private set; }
        public ClientRepository Client { get; private set; }
        public ProductRepository Product { get; private set; }
        public GenericRepository<Warranty> Warranty { get; private set; }

        public void Complete()
        {
            _context.SaveChanges();
        }

        public void BeginTransaction()
        {
            _context.Database.BeginTransaction();
        }

        public void CommitTransaction()
        {
            _context.Database.CommitTransaction();
        }

        public void RollbackTransaction()
        {
            _context.Database.RollbackTransaction();
        }
    }
}
