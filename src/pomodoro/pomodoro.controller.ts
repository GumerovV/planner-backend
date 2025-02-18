import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { PomodoroService } from './pomodoro.service'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { PomodoroSettingsDto } from './dto/pomodoro-settings.dto'
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto'

@Controller('pomodoro')
export class PomodoroController {
	constructor(private readonly pomodoroService: PomodoroService) {}

	@Get('today')
	@Auth()
	async getTodaySession(@CurrentUser('id') userId: string) {
		return this.pomodoroService.getTodaySession(userId)
	}

	@Get('settings')
	@Auth()
	async getSettings(@CurrentUser('id') userId: string) {
		return this.pomodoroService.getSettings(userId)
	}

	@Put('settings')
	@Auth()
	async updateSettings(
		@CurrentUser('id') userId: string,
		@Body() dto: PomodoroSettingsDto,
	) {
		return this.pomodoroService.updateSettings(userId, dto)
	}

	@Post()
	@HttpCode(200)
	@Auth()
	async create(@CurrentUser('id') userId: string) {
		return this.pomodoroService.create(userId)
	}

	@Put('round/:id')
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	async updateRound(@Param('id') id: string, @Body() dto: PomodoroRoundDto) {
		return this.pomodoroService.updateRound(id, dto)
	}

	@Put('/:id')
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@CurrentUser('id') userId: string,
		@Body() dto: PomodoroSessionDto,
	) {
		return this.pomodoroService.update(userId, id, dto)
	}

	@Delete('/:id')
	@HttpCode(200)
	@Auth()
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.pomodoroService.delete(userId, id)
	}
}
