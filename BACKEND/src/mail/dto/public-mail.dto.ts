import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  message: string;
}

export class B2BLeadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  company: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  need: string;
}

export class NewsletterSubscriptionDto {
  @IsEmail()
  email: string;
}
