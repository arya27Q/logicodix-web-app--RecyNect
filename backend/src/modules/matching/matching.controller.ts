import { Request, Response } from 'express';
import { MatchingService } from './services/matching.service.js';
import { sendSuccess } from '../../utils/api-response.js';

export class MatchingController {
  private matchingService: MatchingService;

  constructor() {
    this.matchingService = new MatchingService();
  }

  public runMatching = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const result = await this.matchingService.executeMatching(req.body, userId);
    return sendSuccess(res, result, 'Pencocokan berhasil dilakukan');
  };

  public getSession = async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const session = await this.matchingService.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesi pencocokan tidak ditemukan',
      });
    }
    return sendSuccess(res, session, 'Berhasil memuat sesi pencocokan');
  };
}
