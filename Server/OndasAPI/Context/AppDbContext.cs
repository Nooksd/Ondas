using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OndasAPI.Models;

namespace OndasAPI.Context;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamMember> TeamMembers { get; set; }
    public DbSet<Service> Services { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Service>().Property(s => s.Status).HasConversion<int>();

        modelBuilder.Entity<Service>().HasOne(s => s.Customer)
            .WithMany()
            .HasForeignKey(s => s.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Service>()
            .HasOne(s => s.Team)
            .WithMany()
            .HasForeignKey(s => s.TeamId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Customer>().HasOne(c => c.Address)
            .WithOne()
            .HasForeignKey<Customer>(c => c.AddressId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Service>().HasIndex(s => s.ServiceDate);
        modelBuilder.Entity<Service>().HasIndex(s => s.Status);
        modelBuilder.Entity<Customer>().HasIndex(x => x.Cpf).IsUnique();
        modelBuilder.Entity<Employee>().HasIndex(x => x.Cpf).IsUnique();

        modelBuilder.Entity<Service>().Property(s => s.Price).HasPrecision(18, 2);
        modelBuilder.Entity<Employee>().Property(e => e.Salary).HasPrecision(18, 2);
    }
}