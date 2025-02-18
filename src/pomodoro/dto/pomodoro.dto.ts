import { IsBoolean, IsNumber, IsOptional } from 'class-validator'

export class PomodoroSessionDto {
	@IsBoolean()
	@IsOptional()
	isCompleted: boolean
}

export class PomodoroRoundDto {
	@IsNumber()
	totalSeconds: number

	@IsBoolean()
	@IsOptional()
	isCompleted: boolean
}
