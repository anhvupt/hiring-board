using HiringBoard.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HiringBoard.Api.Infrastructure.Database.Context;

public class EfContext(DbContextOptions options, IConfiguration config) : DbContext(options)
{
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<Interview> Interviews { get; set; }
    public DbSet<Interviewer> Interviewers { get; set; }
    public DbSet<Stage> Stages { get; set; }

    public static readonly ILoggerFactory ConsoleLoggerFactory
          = LoggerFactory.Create(builder =>
          {
              builder
               .AddFilter((category, level) =>
                   category == DbLoggerCategory.Database.Command.Name
                   && level == LogLevel.Information)
               .AddConsole();
          });

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseLoggerFactory(ConsoleLoggerFactory).EnableSensitiveDataLogging();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Interview>(builder =>
        {
            builder.HasOne(x => x.Stage)
            .WithMany(x => x.Interviews)
            .HasForeignKey(x => x.StageId)
            .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Candidate>(builder =>
        {
            builder.HasOne<Interview>()
            .WithOne(x => x.Candidate)
            .HasForeignKey<Interview>(x => x.CandidateId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.FirstName).HasDatabaseName("IX_Candidate_Firstname");
            builder.HasIndex(x => x.LastName).HasDatabaseName("Ix_Candidate_Lastname");
        });

        modelBuilder.Entity<Interviewer>()
            .HasMany(x => x.Interviews)
            .WithOne(x => x.Interviewer)
            .HasForeignKey(x => x.InterviewerId)
            .OnDelete(DeleteBehavior.SetNull);

        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        var random = new Random();

        modelBuilder.Entity<Interviewer>().HasData(Enumerable.Range(1, 3)
            .Select(id => new Interviewer
            {
                Id = id,
                IsDeleted = false,
                Name = Faker.Name.FullName()
            }));

        modelBuilder.Entity<Stage>().HasData(new List<Stage>
        {
            new Stage{Id = 1, IsDeleted = false, Name="Applied"},
            new Stage{Id = 2, IsDeleted = false, Name="Interviewing"},
            new Stage{Id = 3, IsDeleted = false, Name="Offered"},
            new Stage{Id = 4, IsDeleted = false, Name="Hired"}
        });

        modelBuilder.Entity<Candidate>().HasData(Enumerable.Range(1, 10)
            .Select(id => new Candidate
            {
                Id = id,
                FirstName = Faker.Name.First(),
                LastName = Faker.Name.Last(),
                Email = Faker.Internet.Email(),
                IsDeleted = false,
                Phone = Faker.Phone.Number()
            }));

        modelBuilder.Entity<Interview>().HasData(Enumerable.Range(1, 10)
            .Select(id => new Interview
            {
                Id = id,
                CandidateId = id,
                InterviewDate = DateTime.Now,
                Notes = string.Join(" ", Faker.Lorem.Sentences(1).ToList()),
                IsDeleted = false,
                StageId = random.Next(1, 4),
                InterviewerId = random.Next(1, 3)
            }));
    }
}
