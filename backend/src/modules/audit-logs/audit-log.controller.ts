import type { Request, Response } from 'express';
import { AuditLogService } from './audit-log.service.js';
import { sendSuccess } from '../../utils/api-response.js';

export class AuditLogController {
  private readonly auditLogService = new AuditLogService();

  public getLogs = async (req: Request, res: Response) => {
    const { page, limit, userId, action, entity, startDate, endDate } = req.query;

    const result = await this.auditLogService.getLogs({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      userId: typeof userId === 'string' ? userId : undefined,
      action: typeof action === 'string' ? action : undefined,
      entity: typeof entity === 'string' ? entity : undefined,
      startDate: typeof startDate === 'string' ? startDate : undefined,
      endDate: typeof endDate === 'string' ? endDate : undefined,
    });

    return sendSuccess(res, result, 'Berhasil memuat data audit log aktivitas');
  };
}

