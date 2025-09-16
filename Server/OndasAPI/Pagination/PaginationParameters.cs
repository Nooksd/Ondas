namespace OndasAPI.Pagination;

public class PaginationParameters
{
    const int maxPageSize = 100;
    public int Page { get; set; } = 1;
    private int _size = 10;

    public int Size
    {
        get { return _size; }
        set
        {
            _size = (value > maxPageSize) ? maxPageSize : value;
        }
    }

}