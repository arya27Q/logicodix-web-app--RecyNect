import { Request, Response } from 'express';
import { MatchingService } from './services/matching.service.js';
import { sendError, sendSuccess } from '../../utils/api-response.js';
import { createAuditLog } from '../audit-logs/audit-log.service.js';
import { AUDIT_ACTIONS } from '../audit-logs/audit-log.types.js';

export class MatchingController {
  private matchingService: MatchingService;

  constructor() {
    this.matchingService = new MatchingService();
  }

  public runMatching = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub || null;
    const result = await this.matchingService.executeMatching(req.body, userId);
    await createAuditLog({
      req,
      userId,
      action: AUDIT_ACTIONS.MATCHING_CREATED,
      entity: 'MatchingSession',
      entityId: result.sessionId,
      metadata: {
        priority: result.priority,
        searchRadiusKm: result.searchRadiusKm,
        itemsCount: req.body?.items?.length || 0,
        alternativesCount: result.alternatives?.length || 0,
      },
    });
    return sendSuccess(res, result, 'Pencocokan berhasil dilakukan');
  };

  public getSession = async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const session = await this.matchingService.getSessionById(sessionId);
    if (!session) {
      return sendError(res, 'Sesi pencocokan tidak ditemukan.', 404);
    }
    return sendSuccess(res, session, 'Berhasil memuat sesi pencocokan');
  };
}

