import { db } from './src/config/database.js';
import { createAuditLog, AuditLogService } from './src/modules/audit-logs/audit-log.service.js';
import { AUDIT_ACTIONS } from './src/modules/audit-logs/audit-log.types.js';

async function main() {
  console.log('--- 1. Testing createAuditLog() ---');
  await createAuditLog({
    userId: 'test-user-uuid',
    action: AUDIT_ACTIONS.LOGIN_SUCCESS,
    entity: 'User',
    entityId: 'test-user-uuid',
    ipAddress: '127.0.0.1',
    userAgent: 'AuditLogTestRunner/1.0',
    metadata: {
      email: 'tester@recynect.id',
      password: 'SuperSecretPassword123!', // Harusnya di-redact
      token: 'jwt-super-secret-token', // Harusnya di-redact
      role: 'user',
    },
  });
  console.log('createAuditLog() executed successfully.');

  console.log('--- 2. Verifying saved log in Supabase DB ---');
  const service = new AuditLogService();
  const result = await service.getLogs({
    action: AUDIT_ACTIONS.LOGIN_SUCCESS,
    limit: 5,
  });

  console.log(`Found ${result.logs.length} audit logs. Total in DB: ${result.pagination.total}`);
  const latestLog = result.logs[0];
  console.log('Latest Log Details:', {
    id: latestLog?.id,
    action: latestLog?.action,
    entity: latestLog?.entity,
    ipAddress: latestLog?.ipAddress,
    metadata: latestLog?.metadata,
  });

  // Verify that password was redacted
  const meta = latestLog?.metadata as any;
  if (meta?.password === '[REDACTED]' && meta?.token === '[REDACTED]') {
    console.log('SUCCESS: Sensitive keys (password, token) are properly [REDACTED]!');
  } else {
    console.error('FAILED: Sensitive keys were not redacted!', meta);
    process.exit(1);
  }

  console.log('--- 3. Testing Pagination & Filtering ---');
  const filtered = await service.getLogs({
    entity: 'User',
    page: 1,
    limit: 2,
  });
  console.log('Filtered page 1 limit 2:', {
    count: filtered.logs.length,
    page: filtered.pagination.page,
    limit: filtered.pagination.limit,
    totalPages: filtered.pagination.totalPages,
  });

  console.log('ALL AUDIT LOG TESTS PASSED SUCCESSFULLY! ALL CLEAR.');
  await db.$disconnect();
}

main().catch((err) => {
  console.error('Audit log test failed:', err);
  process.exit(1);
});
