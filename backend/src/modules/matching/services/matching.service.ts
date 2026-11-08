import { MatchingRequest } from '../../../types/index.js';
import { EligibilityService } from './eligibility.service.js';
import { DistanceService } from './distance.service.js';
import { ScoringService } from './scoring.service.js';
import { CombinationService } from './combination.service.js';
import { MatchingRepository } from '../matching.repository.js';

export class MatchingService {
  private eligibilityService: EligibilityService;
  private distanceService: DistanceService;
  private scoringService: ScoringService;
  private combinationService: CombinationService;
  private matchingRepository: MatchingRepository;

  constructor() {
    this.eligibilityService = new EligibilityService();
    this.distanceService = new DistanceService();
    this.scoringService = new ScoringService();
    this.combinationService = new CombinationService();
    this.matchingRepository = new MatchingRepository();
  }

  /**
   * Mengorkestrasi alur pencocokan & simpan snapshot hasil ke database
   */
  public async executeMatching(request: MatchingRequest) {
    // 1. Eksekusi kalkulasi algoritma
    // 2. Simpan session & snapshot alternatif via matchingRepository
    const session = await this.matchingRepository.saveMatchingSession({
      latitude: request.latitude,
      longitude: request.longitude,
      priority: request.priority,
    });

    return {
      sessionId: session.id,
      priority: request.priority,
      alternatives: [],
    };
  }
}
