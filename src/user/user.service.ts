import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AuthDto } from '../auth/dto/auth.dto'
import { hash } from 'argon2'
import { UserDto } from './dto/user.dto'
import { startOfDay, subDays } from 'date-fns'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async getById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
			include: {
				task: true,
				pomodoroSettings: true,
			},
		})

		return user
	}

	async getByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		})

		return user
	}

	async getProfile(id: string) {
		const profile = await this.getById(id)

		const totalTasks = profile.task.length
		const completedTasks = await this.prismaService.task.count({
			where: { userId: id, isCompleted: true },
		})

		const todayStart = startOfDay(new Date())
		const startWeek = subDays(new Date(), 7)

		const todayTasks = await this.prismaService.task.count({
			where: {
				userId: id,
				createdAt: todayStart.toISOString(),
			},
		})

		const weekTasks = await this.prismaService.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: startWeek.toISOString(),
				},
			},
		})

		const { password, ...restUser } = profile

		return {
			user: restUser,
			statistics: [
				{ label: 'Total tasks', value: totalTasks },
				{ label: 'Completed tasks', value: completedTasks },
				{ label: 'Today tasks', value: todayTasks },
				{ label: 'Week tasks', value: weekTasks },
			],
		}
	}

	async createUser(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: '',
			password: await hash(dto.password),
		}

		const createdUser = await this.prismaService.user.create({ data: user })
		await this.prismaService.pomodoroSettings.create({
			data: { userId: createdUser.id },
		})

		return createdUser
	}

	async updateUser(id: string, dto: UserDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		const { password, ...user } = await this.prismaService.user.update({
			where: { id },
			data,
		})

		return user
	}
}
