import { IsNumber, IsOptional } from 'class-validator'

export class PomodoroSettingsDto {
	@IsNumber()
	@IsOptional()
	workInterval: number

	@IsNumber()
	@IsOptional()
	breakInterval: number

	@IsNumber()
	@IsOptional()
	intervalCount: number
}
