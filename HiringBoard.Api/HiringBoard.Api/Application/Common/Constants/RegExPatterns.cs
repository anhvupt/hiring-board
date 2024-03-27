namespace HiringBoard.Api.Application.Common.Constants;

public static class RegExPatterns
{
    public const string IsEmail = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
    public const string IsPhoneNumber = @"^[0 - 9\-.+]+$";
}
