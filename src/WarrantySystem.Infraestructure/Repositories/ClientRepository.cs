using Microsoft.EntityFrameworkCore;
using WarrantySystem.Domain.Entities;
using WarrantySystem.Infraestructure.Context;

namespace WarrantySystem.Infraestructure.Repositories
{
    public class ClientRepository
    {
        private readonly ApplicationDbContext _context;

        public ClientRepository(ApplicationDbContext dataContext)
        {
            _context = dataContext;
        }

        public IEnumerable<Client> GetAll()
        {
            var _clients = _context.Clients.ToList();

            return _clients;
        }

        public Client GetById(int id)
        {
            var client = _context.Clients.FirstOrDefault(c => c.Id == id);

            return client;
        }

        public int Create(Client client)
        {
            _context.Clients.Add(client);

            return client.Id;
        }

        public void Update(int id, Client request)
        {
            var client = _context.Clients.FirstOrDefault(c => c.Id == id);

            client.FirstName = request.FirstName;
            client.LastName = request.LastName;
            client.Email = request.Email;
            client.PhoneNumber = request.PhoneNumber;
            client.Address = request.Address;
            client.UpdatedDate = DateTime.UtcNow;

            _context.Clients.Update(client);
        }

        public void Update(Client client)
        {
            _context.Clients.Update(client);
        }

        public void Delete(int id)
        {
            var client = _context.Clients.FirstOrDefault(c => c.Id == id);

            _context.Clients.Remove(client);
        }

        public void Delete(Client client)
        {
            _context.Clients.Remove(client);
        }
    }
}
