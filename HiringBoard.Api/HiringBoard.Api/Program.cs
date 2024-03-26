using HiringBoard.Api.Application;
using Serilog;

WebApplication
    .CreateBuilder(args)
    .ConfigServices()
    .Build()
    .Start();


