using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace WarrantySystem.API.Controllers
{
    public class BaseController : ControllerBase
    {
        public readonly IMapper Mapper;

        public BaseController(IMapper mapper)
        {
            Mapper = mapper;
        }
    }
}
