import { IsEmail, IsString, MinLength } from 'class-validator'

export class UserDto {
	@IsEmail()
	@IsString()
	email?: string

	@IsString()
	name?: string

	@MinLength(6, { message: 'Password must be at least 6 characters long!' })
	@IsString()
	password?: string
}
