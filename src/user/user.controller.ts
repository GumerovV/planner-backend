import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserDto } from './dto/user.dto'

@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Auth()
	async getProfile(@CurrentUser('id') userId: string) {
		return this.userService.getProfile(userId)
	}

	@Put()
	@HttpCode(200)
	@Auth()
	async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UserDto) {
		return this.userService.updateUser(userId, dto)
	}
}
