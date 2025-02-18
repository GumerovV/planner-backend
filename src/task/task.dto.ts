import {
	IsBoolean,
	IsDate,
	IsEnum,
	IsOptional,
	IsString,
} from 'class-validator'
import { Priority } from '@prisma/client'
import { Transform } from 'class-transformer'

export class TaskDto {
	@IsString()
	@IsOptional()
	name: string

	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean

	@IsDate()
	@IsOptional()
	@Transform(({ value }) => new Date(value))
	createdAt?: Date

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority?: Priority
}
