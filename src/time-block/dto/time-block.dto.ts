import { IsNumber, IsOptional, IsString } from 'class-validator'

export class TimeBlockDto {
	@IsString()
	@IsOptional()
	name: string

	@IsString()
	@IsOptional()
	color: string

	@IsNumber()
	@IsOptional()
	duration: number

	@IsNumber()
	@IsOptional()
	order: number
}
