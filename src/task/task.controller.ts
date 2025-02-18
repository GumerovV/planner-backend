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
import { TaskService } from './task.service'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { TaskDto } from './task.dto'

@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.taskService.getAll(userId)
	}

	@Post()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async create(@CurrentUser('id') userId: string, @Body() dto: TaskDto) {
		return this.taskService.create(userId, dto)
	}

	@Put('/:id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async update(
		@Param('id') id: string,
		@CurrentUser('id') userId: string,
		@Body() dto: TaskDto,
	) {
		return this.taskService.update(userId, id, dto)
	}

	@Delete('/:id')
	@HttpCode(200)
	@Auth()
	async delete(@Param('id') id: string) {
		return this.taskService.delete(id)
	}
}
