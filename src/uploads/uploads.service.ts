import { Injectable, Logger } from '@nestjs/common';
import { put } from '@vercel/blob';

@Injectable()
export class UploadsService {
    private readonly logger = new Logger(UploadsService.name);

    async uploadFile(file: Express.Multer.File) {
        if (!file) {
            throw new Error('File is required');
        }

        // Note: In a real Vercel environment, BLOB_READ_WRITE_TOKEN is auto-injected.
        // For local dev, we need to set it in .env
        const { url } = await put(file.originalname, file.buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        this.logger.log(`File uploaded: ${url}`);
        return { url };
    }
}
