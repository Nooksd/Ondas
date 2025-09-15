using OndasAPI.Context;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class UnitOfWork(AppDbContext appDbContext) : IUnitOfWork
{
    //private IProductRepository? _productRepository;
    //private ICategoryRepository? _categoryRepository;
    public AppDbContext _context = appDbContext;

    //public IProductRepository ProductRepository
    //{
    //    get
    //    {
    //        return _productRepository = _productRepository ?? new ProductRepository(_context);
    //    }
    //}

    //public ICategoryRepository CategoryRepository
    //{
    //    get
    //    {
    //        return _categoryRepository = _categoryRepository ?? new CategoryRepository(_context);
    //    }
    //}

    public async Task CommitAsync()
    {
        await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}