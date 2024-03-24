using AutoMapper;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;

public static class UpdateCandidateDetails
{
    public static IEndpointRouteBuilder MapUpdateCandidateDetails(this IEndpointRouteBuilder app)
    {
        app.MapPut("candidates/{id}", async (IMediator mediator, Command query) => await mediator.Send(query))
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);
        return app;
    }

    public class Command : IRequest<List<Response>>
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

    public class Handler(IServiceProvider sp) : AbstractHandler<Command, List<Response>>(sp)
    {
        public override async Task<List<Response>> Handle(Command request, CancellationToken cancellationToken)
        {
            var list = await DbSet<Stage>().AsNoTracking()
                .Where(x => !x.IsDeleted)
                .ToListAsync();

            return Mapper.Map<List<Response>>(list);
        }
    }
}