using AutoMapper;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;
public static class GetInterviewers
{
    public static IEndpointRouteBuilder MapGetInterviewers(this IEndpointRouteBuilder app)
    {
        app.MapGet("interviewers", async (IMediator mediator, Query query) => await mediator.Send(query))
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);
        return app;
    }

    public class Query : IRequest<List<Response>>;

    public class Response
    {
        public string Name { get; set; }
    }

    public class ResponseProfile : Profile
    {
        public ResponseProfile()
        {
            CreateMap<Interviewer, Response>();
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<Query, List<Response>>(sp)
    {
        public override async Task<List<Response>> Handle(Query request, CancellationToken cancellationToken)
        {
            var list = await DbSet<Interview>().AsNoTracking().ToListAsync();
            return Mapper.Map<List<Response>>(list);
        }
    }
}



