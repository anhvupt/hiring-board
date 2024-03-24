using HiringBoard.Api.Application;
using Serilog;

Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .CreateLogger();

WebApplication
    .CreateBuilder(args)
    .ConfigServices()
    .Build()
    .Start();


