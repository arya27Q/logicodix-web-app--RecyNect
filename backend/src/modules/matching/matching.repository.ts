// Khusus query database tabel 'matching_sessions', 'matching_results', & snapshot
export class MatchingRepository {
  public async saveMatchingSession(sessionData: any) {
    // TODO: Query Prisma `db.matchingSession.create({ data: sessionData })`
    return { id: `sess-${Date.now()}`, ...sessionData };
  }

  public async getSessionById(sessionId: string) {
    // TODO: Query Prisma `db.matchingSession.findUnique({ where: { id: sessionId }, include: { results: true } })`
    return null;
  }
}
