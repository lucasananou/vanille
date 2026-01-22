import { Controller, Post, Get, Patch, Delete, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerAuthService } from './customer-auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CustomerGuard } from './guards/customer.guard';
import {
    RegisterCustomerDto,
    LoginCustomerDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    VerifyEmailDto,
    UpdateProfileDto,
} from './dto/customer-auth.dto';

@ApiTags('Customer Auth')
@Controller('auth/customer')
export class CustomerAuthController {
    constructor(private customerAuthService: CustomerAuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new customer' })
    @ApiResponse({ status: 201, description: 'Customer registered successfully' })
    async register(@Body() registerDto: RegisterCustomerDto) {
        return this.customerAuthService.register(registerDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Login as customer' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    async login(@Body() loginDto: LoginCustomerDto) {
        return this.customerAuthService.login(loginDto);
    }

    @Post('verify-email')
    @HttpCode(200)
    @ApiOperation({ summary: 'Verify customer email' })
    async verifyEmail(@Body() verifyDto: VerifyEmailDto) {
        return this.customerAuthService.verifyEmail(verifyDto.token);
    }

    @Post('forgot-password')
    @HttpCode(200)
    @ApiOperation({ summary: 'Request password reset' })
    async forgotPassword(@Body() forgotDto: ForgotPasswordDto) {
        return this.customerAuthService.forgotPassword(forgotDto);
    }

    @Post('reset-password')
    @HttpCode(200)
    @ApiOperation({ summary: 'Reset password with token' })
    async resetPassword(@Body() resetDto: ResetPasswordDto) {
        return this.customerAuthService.resetPassword(resetDto);
    }

    @Post('refresh')
    @HttpCode(200)
    @ApiOperation({ summary: 'Refresh access token' })
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        return this.customerAuthService.refreshToken(refreshToken);
    }
}

@ApiTags('Customer Profile')
@ApiBearerAuth()
@Controller('customer')
@UseGuards(CustomerGuard)
export class CustomerProfileController {
    constructor(private customerAuthService: CustomerAuthService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get customer profile' })
    async getProfile(@CurrentUser() customer: any) {
        return this.customerAuthService.getProfile(customer.id);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Update customer profile' })
    async updateProfile(
        @CurrentUser() customer: any,
        @Body() updateDto: UpdateProfileDto,
    ) {
        return this.customerAuthService.updateProfile(customer.id, updateDto);
    }

    @Delete('account')
    @ApiOperation({ summary: 'Delete customer account' })
    async deleteAccount(@CurrentUser() customer: any) {
        return this.customerAuthService.deleteAccount(customer.id);
    }
}
