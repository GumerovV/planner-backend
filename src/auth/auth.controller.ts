import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto)
		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@Post('register')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, ...response } = await this.authService.register(dto)
		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@Post('login/access-token')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const refreshTokenFromCookie =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFromCookie) {
			this.authService.removeRefreshToken(res)
			throw new UnauthorizedException('Invalid auth session')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookie,
		)
		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@Post('logout')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshToken(res)

		return true
	}
}
