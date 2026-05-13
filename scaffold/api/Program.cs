var builder = WebApplication.CreateBuilder(args);

// CORS — permissive for prototype
builder.Services.AddCors(o =>
    o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// Register services
// builder.Services.AddSingleton<DataService>(); // uncomment after /vibe-data-prep

var app = builder.Build();
app.UseCors();

// Health endpoints
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));
app.MapGet("/alive", () => Results.Ok());

// Data endpoints — add after running /vibe-data-prep
// Example:
// app.MapGet("/api/people", (DataService data) => data.GetAll<Person>());
// app.MapGet("/api/people/{id}", (string id, DataService data) => data.GetById<Person>(id));

app.Run();
