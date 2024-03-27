using AutoMapper;
using HiringBoard.Api.Application.Common.Constants;
using HiringBoard.Api.Application.Features.Common;
using HiringBoard.Api.Domain.Entities;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace HiringBoard.Api.Application.Features.Interviews;

public static class CreateCandidate
{
    public static IEndpointRouteBuilder MapCreateCandidate(this IEndpointRouteBuilder app)
    {
        app.MapPost("candidates", async (IMediator mediator, CreateCandidateCommand query) => await mediator.Send(query))
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

        return app;
    }

    public class CreateCandidateCommand : IRequest<CreateCandidateResponse>
    {
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
    }

    public class CreateCandidateResponse
    {
        public int Id { get; set; }
    }

    public class Profile : AutoMapper.Profile
    {
        public Profile()
        {
            CreateMap<CreateCandidateCommand, Candidate>()
                .ForMember(x => x.Id, opt => opt.Ignore())
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

    public class Handler(IServiceProvider sp) : AbstractHandler<CreateCandidateCommand, CreateCandidateResponse>(sp)
    {
        public override async Task<CreateCandidateResponse> Handle(CreateCandidateCommand request, CancellationToken cancellationToken)
        {
            var entity = Mapper.Map<Candidate>(request);
            DbSet<Candidate>().Add(entity);
            await Uow.SaveChangesAsync(cancellationToken);

            return new CreateCandidateResponse { Id = entity.Id };
        }
    }
}
