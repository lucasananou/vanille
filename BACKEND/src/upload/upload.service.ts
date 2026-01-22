import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
    constructor(private configService: ConfigService) {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File, folder = 'products'): Promise<{
        url: string;
        publicId: string;
        thumbnails: {
            small: string;
            medium: string;
            large: string;
        };
    }> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException('File size exceeds 5MB limit');
        }

        try {
            // Process main image (optimize and convert to WebP)
            const processedBuffer = await sharp(file.buffer)
                .resize(2000, 2000, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: 85 })
                .toBuffer();

            // Upload main image
            const mainUpload = await this.uploadToCloudinary(processedBuffer, folder, 'main');

            // Generate thumbnails
            const thumbnails = await this.generateThumbnails(file.buffer, folder);

            return {
                url: mainUpload.secure_url,
                publicId: mainUpload.public_id,
                thumbnails,
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw new BadRequestException('Failed to upload image');
        }
    }

    async uploadMultipleImages(files: Express.Multer.File[], folder = 'products'): Promise<Array<{
        url: string;
        publicId: string;
        thumbnails: {
            small: string;
            medium: string;
            large: string;
        };
    }>> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        const uploadPromises = files.map(file => this.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Delete error:', error);
            throw new BadRequestException('Failed to delete image');
        }
    }

    private async generateThumbnails(buffer: Buffer, folder: string): Promise<{
        small: string;
        medium: string;
        large: string;
    }> {
        // Small thumbnail (150x150)
        const smallBuffer = await sharp(buffer)
            .resize(150, 150, { fit: 'cover' })
            .webp({ quality: 80 })
            .toBuffer();

        // Medium thumbnail (400x400)
        const mediumBuffer = await sharp(buffer)
            .resize(400, 400, { fit: 'cover' })
            .webp({ quality: 85 })
            .toBuffer();

        // Large thumbnail (800x800)
        const largeBuffer = await sharp(buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();

        // Upload all thumbnails
        const [small, medium, large] = await Promise.all([
            this.uploadToCloudinary(smallBuffer, folder, 'small'),
            this.uploadToCloudinary(mediumBuffer, folder, 'medium'),
            this.uploadToCloudinary(largeBuffer, folder, 'large'),
        ]);

        return {
            small: small.secure_url,
            medium: medium.secure_url,
            large: large.secure_url,
        };
    }

    private async uploadToCloudinary(
        buffer: Buffer,
        folder: string,
        suffix: string,
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `ecommerce/${folder}`,
                    resource_type: 'image',
                    format: 'webp',
                    public_id: `${Date.now()}-${suffix}`,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed - no result'));
                    resolve(result);
                },
            );

            const readable = Readable.from(buffer);
            readable.pipe(uploadStream);
        });
    }
}
