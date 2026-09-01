import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@Controller({ path: 'documents', version: '1' })
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('health')
  health() { return { module: 'documents', status: 'ok' }; }
}
