using OndasAPI.Context;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class UnitOfWork(AppDbContext appDbContext) : IUnitOfWork
{
    private IAddressRepository? _addressRepository;
    private ICustomerRepository? _customerRepository;
    private IEmployeeRepository? _employeeRepository;
    private IServiceRepository? _serviceRepository;
    private ITeamMemberRepository? _teamMemberRepository;
    private ITeamRepository? _teamRepository;
    private INotificationConfigRepository? _notificationConfigRepository;
    private INotificationLogRepository? _notificationLogRepository;

    public AppDbContext _context = appDbContext;

    public IAddressRepository AddressRepository
    {
        get
        {
            return _addressRepository = _addressRepository ?? new AddressRepository(_context);
        }
    }

    public ICustomerRepository CustomerRepository
    {
        get
        {
            return _customerRepository = _customerRepository ?? new CustomerRepository(_context);
        }
    }

    public IEmployeeRepository EmployeeRepository
    {
        get
        {
            return _employeeRepository = _employeeRepository ?? new EmployeeRepository(_context);
        }
    }

    public IServiceRepository ServiceRepository
    {
        get
        {
            return _serviceRepository = _serviceRepository ?? new ServiceRepository(_context);
        }
    }

    public ITeamMemberRepository TeamMemberRepository
    {
        get
        {
            return _teamMemberRepository = _teamMemberRepository ?? new TeamMemberRepository(_context);
        }
    }

    public ITeamRepository TeamRepository

    {
        get
        {
            return _teamRepository = _teamRepository ?? new TeamRepository(_context);
        }
    }

    public INotificationConfigRepository NotificationConfigRepository
    {
        get
        {
            return _notificationConfigRepository = _notificationConfigRepository ?? new NotificationConfigRepository(_context);
        }
    }

    public INotificationLogRepository NotificationLogRepository
    {
        get
        {
            return _notificationLogRepository = _notificationLogRepository ?? new NotificationLogRepository(_context);
        }
    }

    public async Task CommitAsync()
    {
        await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}