using System.Linq.Expressions;

namespace OndasAPI.Repositories.Interfaces;

public interface IRepository<T>
{
    IQueryable<T> GetAll();
    Task<T?> GetAsync(Expression<Func<T, bool>> predicate);
    T Create(T entity);
    T Update(T entity);
    T Delete(T entity);

}