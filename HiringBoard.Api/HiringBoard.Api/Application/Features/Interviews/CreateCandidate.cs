using AutoMapper;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;

public static class CreateCandidate
{
    public static IEndpointRouteBuilder MapCreateCandidate(this IEndpointRouteBuilder app)
    {
        app.MapPost("candidates", async (IMediator mediator, Command query) => await mediator.Send(query))
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

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
