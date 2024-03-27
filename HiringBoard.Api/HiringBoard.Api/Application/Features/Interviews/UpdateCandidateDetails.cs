using AutoMapper;
using HiringBoard.Api.Application.Common.Constants;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace HiringBoard.Api.Application.Features.Interviews;

public static class UpdateCandidateDetails
{
    public static IEndpointRouteBuilder MapUpdateCandidateDetails(this IEndpointRouteBuilder app)
    {
        app.MapPut("candidates/{id}",
            async (IMediator mediator, [FromRoute] int Id, [FromBody] UpdateCandidateDetailsCommand query) => await mediator.Send(query))
            .Produces(StatusCodes.Status204NoContent);

        return app;
    }

    public class UpdateCandidateDetailsCommand : IRequest<IResult>
    {
        [FromRoute] public int Id { get; set; }
        [MaxLength(100)]
        public string FirstName { get; set; }
        [MaxLength(100)]
        public string LastName { get; set; }
        [RegularExpression(RegExPatterns.IsEmail)]
        public string Email { get; set; }
        [RegularExpression(RegExPatterns.IsPhoneNumber)]
        public string Phone { get; set; }
        [MaxLength(500)]
        public string Notes { get; set; }
        [Range(1, int.MaxValue)]
        public int InterviewerId { get; set; }
        [Range(1, int.MaxValue)]
        public int StageId { get; set; }
        public DateTime InterviewDate { get; set; }
    }

    public class Profile : AutoMapper.Profile
    {
        public Profile()
        {
            CreateMap<UpdateCandidateDetailsCommand, Candidate>()
                .AfterMap((src, target) =>
                {
                    target.Interview = new Interview
                    {
                        Notes = src.Notes,
                        InterviewerId = src.InterviewerId,
                        StageId = src.StageId
                    };
                });
        }
    }

    public class Handler(IServiceProvider sp) : AbstractHandler<UpdateCandidateDetailsCommand, IResult>(sp)
    {
        public override async Task<IResult> Handle(UpdateCandidateDetailsCommand request, CancellationToken cancellationToken)
        {
            var entity = await DbSet<Candidate>().FindAsync(request.Id, cancellationToken);
            if (entity == null)
            {
                return TypedResults.NotFound();
            }
            Mapper.Map(request, entity);
            await Uow.SaveChangesAsync(cancellationToken);

            return TypedResults.NoContent();
        }
    }
}