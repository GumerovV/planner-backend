import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TaskDto } from './task.dto'

@Injectable()
export class TaskService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll(userId: string) {
		const tasks = await this.prismaService.task.findMany({ where: { userId } })

		return tasks
	}

	async create(userId: string, dto: TaskDto) {
		const task = this.prismaService.task.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})

		return task
	}

	async update(userId: string, id: string, dto: Partial<TaskDto>) {
		const task = await this.prismaService.task.update({
			where: { id, userId },
			data: dto,
		})

		return task
	}

	async delete(id: string) {
		return this.prismaService.task.delete({ where: { id } })
	}
}
