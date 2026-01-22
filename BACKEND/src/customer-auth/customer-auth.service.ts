import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import {
    RegisterCustomerDto,
    LoginCustomerDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    UpdateProfileDto,
} from './dto/customer-auth.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class CustomerAuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
    ) { }

    async register(registerDto: RegisterCustomerDto) {
        const { email, password, firstName, lastName, phone } = registerDto;

        // Check if customer already exists
        const existing = await this.prisma.customer.findUnique({
            where: { email },
        });

        if (existing) {
            throw new ConflictException('Customer with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = randomBytes(32).toString('hex');

        // Create customer
        const customer = await this.prisma.customer.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                verificationToken,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                emailVerified: true,
                createdAt: true,
            },
        });

        // Send verification email
        try {
            await this.mailService.sendEmail({
                to: email,
                subject: 'Verify Your Email',
                html: this.getVerificationEmailTemplate(firstName, verificationToken),
            });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Don't block registration if email fails
        }

        return {
            customer,
            message: 'Registration successful. Please check your email to verify your account.',
        };
    }

    async login(loginDto: LoginCustomerDto) {
        const { email, password } = loginDto;

        // Find customer
        const customer = await this.prisma.customer.findUnique({
            where: { email },
        });

        if (!customer) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate tokens
        const payload = { sub: customer.id, email: customer.email, type: 'customer' };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
        } as any);

        return {
            accessToken,
            refreshToken,
            customer: {
                id: customer.id,
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone,
                emailVerified: customer.emailVerified,
            },
        };
    }

    async verifyEmail(token: string) {
        const customer = await this.prisma.customer.findFirst({
            where: { verificationToken: token },
        });

        if (!customer) {
            throw new BadRequestException('Invalid verification token');
        }

        await this.prisma.customer.update({
            where: { id: customer.id },
            data: {
                emailVerified: true,
                verificationToken: null,
            },
        });

        return { message: 'Email verified successfully' };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

        const customer = await this.prisma.customer.findUnique({
            where: { email },
        });

        if (!customer) {
            // Don't reveal if email exists
            return { message: 'If the email exists, a reset link has been sent.' };
        }

        // Generate reset token
        const resetToken = randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await this.prisma.customer.update({
            where: { id: customer.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // Send reset email
        try {
            await this.mailService.sendEmail({
                to: email,
                subject: 'Reset Your Password',
                html: this.getPasswordResetEmailTemplate(customer.firstName, resetToken),
            });
        } catch (error) {
            console.error('Failed to send reset email:', error);
        }

        return { message: 'If the email exists, a reset link has been sent.' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;

        const customer = await this.prisma.customer.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gte: new Date(),
                },
            },
        });

        if (!customer) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.customer.update({
            where: { id: customer.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return { message: 'Password reset successful' };
    }

    async validateCustomer(customerId: string) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                emailVerified: true,
            },
        });

        if (!customer) {
            throw new UnauthorizedException('Customer not found');
        }

        return customer;
    }

    async getProfile(customerId: string) {
        return this.validateCustomer(customerId);
    }

    async updateProfile(customerId: string, updateDto: UpdateProfileDto) {
        const customer = await this.prisma.customer.update({
            where: { id: customerId },
            data: updateDto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                emailVerified: true,
            },
        });

        return customer;
    }

    async deleteAccount(customerId: string) {
        await this.prisma.customer.delete({
            where: { id: customerId },
        });

        return { message: 'Account deleted successfully' };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            if (payload.type !== 'customer') {
                throw new UnauthorizedException('Invalid token type');
            }

            const newAccessToken = this.jwtService.sign({
                sub: payload.sub,
                email: payload.email,
                type: 'customer',
            });

            return {
                accessToken: newAccessToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private getVerificationEmailTemplate(firstName: string, token: string): string {
        const verifyUrl = `${this.configService.get('APP_URL')}/verify-email?token=${token}`;
        return `
            <h1>Welcome ${firstName}!</h1>
            <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
            <a href="${verifyUrl}">Verify Email</a>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        `;
    }

    private getPasswordResetEmailTemplate(firstName: string, token: string): string {
        const resetUrl = `${this.configService.get('APP_URL')}/reset-password?token=${token}`;
        return `
            <h1>Hello ${firstName},</h1>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        `;
    }
}
