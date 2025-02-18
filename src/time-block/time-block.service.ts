import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TimeBlockDto } from './dto/time-block.dto'

@Injectable()
export class TimeBlockService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll(userId: string) {
		const blocks = await this.prismaService.timeBlock.findMany({
			where: { userId },
			orderBy: {
				order: 'asc',
			},
		})

		return blocks
	}

	async create(userId: string, dto: TimeBlockDto) {
		const block = await this.prismaService.timeBlock.create({
			data: {
				...dto,
				user: {
					connect: { id: userId },
				},
			},
		})

		return block
	}

	async update(userId: string, id: string, dto: Partial<TimeBlockDto>) {
		const block = await this.prismaService.timeBlock.update({
			where: { id, userId },
			data: dto,
		})

		return block
	}

	async delete(id: string) {
		return this.prismaService.timeBlock.delete({ where: { id } })
	}

	async updateOrder(ids: string[]) {
		return this.prismaService.$transaction(
			ids.map((id, order) =>
				this.prismaService.timeBlock.update({ where: { id }, data: { order } }),
			),
		)
	}
}
