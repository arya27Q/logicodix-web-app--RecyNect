import { MatchingRequest } from '../../../types/index.js';
import { EligibilityService } from './eligibility.service.js';
import { DistanceService } from './distance.service.js';
import { ScoringService } from './scoring.service.js';
import { CombinationService } from './combination.service.js';

export class MatchingService {
  private eligibilityService: EligibilityService;
  private distanceService: DistanceService;
  private scoringService: ScoringService;
  private combinationService: CombinationService;

  constructor() {
    this.eligibilityService = new EligibilityService();
    this.distanceService = new DistanceService();
    this.scoringService = new ScoringService();
    this.combinationService = new CombinationService();
  }

  /**
   * Mengorkestrasi seluruh alur pencocokan multi-material
   */
  public async executeMatching(request: MatchingRequest) {
    // TODO: 1. Filter eligibility -> 2. Buat kombinasi -> 3. Hitung jarak & skor -> 4. Urutkan hasil
    return {
      sessionId: `sess-${Date.now()}`,
      priority: request.priority,
      alternatives: [],
    };
  }
}
