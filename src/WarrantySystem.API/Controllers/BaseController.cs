using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;

namespace WarrantySystem.API.Controllers
{
    public class BaseController : ControllerBase
    {
        public readonly ApplicationDbContext Context;

        public BaseController(ApplicationDbContext dataContext)
        {
            Context = dataContext;
        }
    }
}
