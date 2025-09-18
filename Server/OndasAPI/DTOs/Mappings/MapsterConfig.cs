using Mapster;
using OndasAPI.Models;

namespace OndasAPI.DTOs.Mappings;

public class MapsterConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig<Employee, EmployeeDTO>.NewConfig();

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

        TypeAdapterConfig<Customer, CustomerDTO>.NewConfig();
        TypeAdapterConfig<Address, AddressDTO>.NewConfig();

        TypeAdapterConfig<Service, ServiceDTO>.NewConfig()
            .Map(dest => dest.CustomerName, src => src.Customer != null ? src.Customer.Name : null)
            .Map(dest => dest.TeamName, src => src.Team != null ? src.Team.Name : null)
            .Map(dest => dest.PaymentDate, src => src.PaymentDate == default ? (DateTime?)null : src.PaymentDate);

        TypeAdapterConfig<ServiceDTO, Service>.NewConfig().IgnoreNullValues(true);
    }
}
