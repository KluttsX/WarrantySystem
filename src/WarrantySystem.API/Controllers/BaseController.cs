using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WarrantySystem.API.Data;

namespace WarrantySystem.API.Controllers
{
    public class BaseController : ControllerBase
    {
        public readonly ApplicationDbContext Context;
        public readonly IMapper Mapper;

        public BaseController(ApplicationDbContext dataContext, IMapper mapper)
        {
            Context = dataContext;
            Mapper = mapper;
        }
    }
}
