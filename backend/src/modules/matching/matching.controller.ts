import { Request, Response } from 'express';
import { MatchingService } from './services/matching.service.js';
import { sendSuccess } from '../../utils/api-response.js';

export class MatchingController {
  private matchingService: MatchingService;

  constructor() {
    this.matchingService = new MatchingService();
  }

  public runMatching = async (req: Request, res: Response) => {
    // Jalankan matching engine
    const result = await this.matchingService.executeMatching(req.body);
    return sendSuccess(res, result, 'Pencocokan berhasil dilakukan');
  };
}
