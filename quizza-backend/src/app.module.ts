import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    EventsModule,
    ServeStaticModule.forRoot({
      rootPath: join(
        process.cwd(),
        'quizza-frontend',
        'dist',
        'quizza-frontend',
        'browser',
      ),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
