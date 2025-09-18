using Mapster;
using OndasAPI.Models;

namespace OndasAPI.DTOs.Mappings;

public class MapsterConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig<Employee, EmployeeDTO>.NewConfig();
        TypeAdapterConfig<EmployeeDTO, Employee>.NewConfig().IgnoreNullValues(true);

        TypeAdapterConfig<Team, TeamDTO>.NewConfig()
            .Map(dest => dest.TeamMembers, src => src.TeamMembers == null ? new List<TeamMemberDTO>()
                    : src.TeamMembers.Select(tm => new TeamMemberDTO
                    {
                        EmployeeId = tm.EmployeeId,
                        Employee = tm.Employee == null ? null : new EmployeeDTO
                        {
                            Id = tm.Employee.Id,
                            Name = tm.Employee.Name,
                            Role = tm.Employee.Role
                        }
                    }).ToList());
        TypeAdapterConfig<TeamDTO, Team>.NewConfig().IgnoreNullValues(true);

        TypeAdapterConfig<Customer, CustomerDTO>.NewConfig();
        TypeAdapterConfig<CustomerDTO, Customer>.NewConfig().IgnoreNullValues(true);

        TypeAdapterConfig<Address, AddressDTO>.NewConfig();
        TypeAdapterConfig<AddressDTO, Address>.NewConfig().IgnoreNullValues(true);

        TypeAdapterConfig<Service, ServiceDTO>.NewConfig()
            .Map(dest => dest.CustomerName, src => src.Customer != null ? src.Customer.Name : null)
            .Map(dest => dest.TeamName, src => src.Team != null ? src.Team.Name : null)
            .Map(dest => dest.PaymentDate, src => src.PaymentDate == default ? (DateTime?)null : src.PaymentDate);
        TypeAdapterConfig<ServiceDTO, Service>.NewConfig().IgnoreNullValues(true);

        TypeAdapterConfig<AppUser, UserDTO>.NewConfig()
            .Map(dest => dest.Username, src => src.UserName)
            .Map(dest => dest.Email, src => src.Email);
        TypeAdapterConfig<UserDTO, AppUser>.NewConfig()
            .Map(dest => dest.UserName, src => src.Username)
            .Map(dest => dest.Email, src => src.Email)
            .Ignore(dest => dest.PasswordHash!);
    }
}
