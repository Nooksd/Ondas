namespace OndasAPI.Repositories.Interfaces;

public interface IUnitOfWork
{
    IAddressRepository AddressRepository { get; }
    ICustomerRepository CustomerRepository { get; }
    IEmployeeRepository EmployeeRepository { get; }
    IServiceRepository ServiceRepository { get; }
    ITeamMemberRepository TeamMemberRepository { get; }
    ITeamRepository TeamRepository { get; }

    Task CommitAsync();
}