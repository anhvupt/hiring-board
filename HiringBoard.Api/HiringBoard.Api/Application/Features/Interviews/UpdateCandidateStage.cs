using AutoMapper;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;
public static class UpdateCandidateStage
{
    public static IEndpointRouteBuilder MapUpdateCandidateStage(this IEndpointRouteBuilder app)
    {
        app.MapPatch("candidates/stage", async (IMediator mediator, Query query) => await mediator.Send(query))
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);
        return app;
    }

    public class Query : IRequest<List<Response>>
    {
    }

    public class Response
    {
        public string Name { get; set; }
    }

    public class ResponseProfile : Profile
    {
        public ResponseProfile()
        {
            CreateMap<Stage, Response>();
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<Query, List<Response>>(sp)
    {
        public override async Task<List<Response>> Handle(Query request, CancellationToken cancellationToken)
        {
            var list = await DbSet<Stage>().AsNoTracking()
                .Where(x => !x.IsDeleted)
                .ToListAsync();

            return Mapper.Map<List<Response>>(list);
        }
    }
}
