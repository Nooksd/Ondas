using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class AddressRepository(AppDbContext context) : Repository<Address>(context), IAddressRepository
{
}
