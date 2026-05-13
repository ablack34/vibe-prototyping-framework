using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;

namespace Api.Services;

/// <summary>
/// Generic CSV data loading service. Loads all CSV files at startup
/// into in-memory collections for fast query access.
/// 
/// Usage after data prep:
///   builder.Services.AddSingleton&lt;DataService&gt;();
///   var data = app.Services.GetRequiredService&lt;DataService&gt;();
/// </summary>
public class DataService
{
    private readonly string _dataPath;
    private readonly Dictionary<Type, object> _datasets = new();

    public DataService(IWebHostEnvironment env)
    {
        _dataPath = Path.Combine(env.ContentRootPath, "..", "data");
    }

    /// <summary>
    /// Load a CSV file into a typed collection. Call at startup.
    /// </summary>
    public void Load<T>(string filename) where T : class
    {
        var path = Path.Combine(_dataPath, filename);
        if (!File.Exists(path))
            throw new FileNotFoundException($"Data file not found: {path}");

        using var reader = new StreamReader(path);
        using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HeaderValidated = null,
            MissingFieldFound = null,
            TrimOptions = TrimOptions.Trim,
        });

        var records = csv.GetRecords<T>().ToList();
        _datasets[typeof(T)] = records;
    }

    /// <summary>Get all records of a type.</summary>
    public List<T> GetAll<T>() where T : class
    {
        return _datasets.TryGetValue(typeof(T), out var data)
            ? (List<T>)data
            : [];
    }

    /// <summary>Query records with a predicate.</summary>
    public List<T> Query<T>(Func<T, bool> predicate) where T : class
    {
        return GetAll<T>().Where(predicate).ToList();
    }
}
