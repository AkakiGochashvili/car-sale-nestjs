import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalInterceptor } from './common/interceptors/global.interceptor';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true
		})
	);

	app.useGlobalInterceptors(new GlobalInterceptor());

	const config = new DocumentBuilder()
		.setTitle('Car sale - NestJS')
		.setDescription('Car sale - NestJS description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
	};
	const document = SwaggerModule.createDocument(app, config, options);
	SwaggerModule.setup('api', app, document);

	const port = configService.get('PORT');

	await app.listen(port);
}
bootstrap();
