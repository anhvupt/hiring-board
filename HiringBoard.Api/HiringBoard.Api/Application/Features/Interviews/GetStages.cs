using AutoMapper;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Application.Features.Interviews;

public static class GetStages
{
    public static IEndpointRouteBuilder MapGetStages(this IEndpointRouteBuilder app)
    {
        app.MapGet("stages", 
            async (IMediator mediator, [AsParameters] StageListQuery query) => await mediator.Send(query))
            .Produces(StatusCodes.Status200OK);
        
        return app;
    }

    public class StageListQuery : IRequest<List<StageResponse>>
    {
    }

    public class StageResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class ResponseProfile : Profile
    {
        public ResponseProfile()
        {
            CreateMap<Stage, StageResponse>();
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<StageListQuery, List<StageResponse>>(sp)
    {
        public override async Task<List<StageResponse>> Handle(StageListQuery request, CancellationToken cancellationToken)
        {
            var list = await DbSet<Stage>().AsNoTracking()
                .Where(x => !x.IsDeleted)
                .ToListAsync(cancellationToken);

            return Mapper.Map<List<StageResponse>>(list);
        }
    }
}
