import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PomodoroSettingsDto } from './dto/pomodoro-settings.dto'
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto'

@Injectable()
export class PomodoroService {
	constructor(private readonly prismaService: PrismaService) {}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0]
		const session = await this.prismaService.pomodoroSession.findFirst({
			where: { userId, createdAt: { gte: new Date(today) } },
			include: {
				rounds: {
					orderBy: {
						id: 'desc',
					},
				},
			},
		})

		return session
	}

	async create(userId: string) {
		const session = await this.getTodaySession(userId)

		if (session) return session

		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: {
				pomodoroSettings: {
					select: { intervalCount: true },
				},
			},
		})

		if (!user) throw new NotFoundException('User not found!')

		const newSession = await this.prismaService.pomodoroSession.create({
			data: {
				rounds: {
					createMany: {
						data: Array.from(
							{ length: user.pomodoroSettings.intervalCount },
							() => ({ totalSeconds: 0 }),
						),
					},
				},
				user: {
					connect: { id: userId },
				},
			},
			include: { rounds: true },
		})

		return newSession
	}

	async update(userId: string, id: string, dto: Partial<PomodoroSessionDto>) {
		const session = await this.prismaService.pomodoroSession.update({
			where: {
				id,
				userId,
			},
			data: dto,
		})

		return session
	}

	async updateRound(id: string, dto: Partial<PomodoroRoundDto>) {
		const session = await this.prismaService.pomodoroRound.update({
			where: {
				id,
			},
			data: dto,
		})

		return session
	}

	async delete(userId: string, id: string) {
		const session = await this.prismaService.pomodoroSession.delete({
			where: {
				id,
				userId,
			},
		})
	}

	async getSettings(userId: string) {
		const settings = await this.prismaService.pomodoroSettings.findUnique({
			where: { userId },
		})

		return settings
	}

	async updateSettings(userId: string, dto: PomodoroSettingsDto) {
		const settings = await this.prismaService.pomodoroSettings.update({
			where: { userId },
			data: dto,
		})

		return settings
	}
}
