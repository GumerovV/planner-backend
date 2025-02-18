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
import { TimeBlockService } from './time-block.service'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { TimeBlockDto } from './dto/time-block.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Controller('time-block')
export class TimeBlockController {
	constructor(private readonly timeBlockService: TimeBlockService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.timeBlockService.getAll(userId)
	}

	@Post()
	@Auth()
	async create(@CurrentUser('id') userId: string, @Body() dto: TimeBlockDto) {
		return this.timeBlockService.create(userId, dto)
	}

	@Put('/update-order')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async updateOrder(@Body() dto: UpdateOrderDto) {
		return this.timeBlockService.updateOrder(dto.ids)
	}

	@Put('/:id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async update(
		@Param('id') id: string,
		@CurrentUser('id') userId: string,
		@Body() dto: TimeBlockDto,
	) {
		return this.timeBlockService.update(userId, id, dto)
	}

	@Delete('/:id')
	@HttpCode(200)
	@Auth()
	async delete(@Param('id') id: string) {
		return this.timeBlockService.delete(id)
	}
}
