import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { environment } from '../../../../environments/environment';
import { MinioClientService } from './minio.service';

@Module({
  imports: [
    MinioModule.register({
      endPoint: environment.MINIO_ENDPOINT,
      port: environment.MINIO_PORT,
      useSSL: false,
      accessKey: environment.MINIO_ACCESS_KEY,
      secretKey: environment.MINIO_SECRET_KEY,
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
