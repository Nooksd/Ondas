using Microsoft.EntityFrameworkCore;

namespace OndasAPI.Pagination;

public class PagedList<T> : List<T> where T : class
{
    public int CurrentPage { get; private set; }
    public int TotalPages { get; private set; }
    public int PageSize { get; private set; }
    public int TotalCount { get; private set; }

    public bool HasPrevious => CurrentPage > 1;
    public bool HasNext => CurrentPage < TotalPages;

    public PagedList(List<T> items, int page, int size, int totalCount)
    {
        CurrentPage = page;
        PageSize = size;
        TotalCount = totalCount;
        TotalPages = (int)Math.Ceiling(totalCount / (double)size);

        AddRange(items);
    }

    public async static Task<PagedList<T>> ToPagedListAsync(IQueryable<T> source, int page, int size)
    {
        var count = await source.CountAsync();
        List<T> items = await source.Skip((page - 1) * size).Take(size).ToListAsync();

        return new PagedList<T>(items, page, size, count);
    }
}