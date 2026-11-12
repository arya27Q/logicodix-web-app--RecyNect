import { db } from '../../config/database.js';
import type { AuditLogQueryParams, CreateAuditLogOptions } from './audit-log.types.js';

const SENSITIVE_KEYS = new Set([
  'password',
  'currentpassword',
  'newpassword',
  'confirmpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'secret',
  'jwt_secret',
  'authorization',
  'cookie',
  'set-cookie',
]);

/**
 * Membersihkan data metadata dari nilai-nilai sensitif (password, secret, token)
 */
function sanitizeMetadata(data: any, depth = 0): any {
  if (!data || depth > 3) return null;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.slice(0, 50).map((item) => sanitizeMetadata(item, depth + 1));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeMetadata(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Mengekstrak IP address dari request secara akurat (mendukung proxy / cloud reverse proxy)
 */
function extractIpAddress(req?: any): string | null {
  if (!req) return null;
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
}

/**
 * Mengekstrak User-Agent dari request
 */
function extractUserAgent(req?: any): string | null {
  if (!req?.headers) return null;
  const ua = req.headers['user-agent'];
  return typeof ua === 'string' ? ua.slice(0, 500) : null;
}

/**
 * Helper Reusable untuk mencatat Audit Log:
 * - Tidak akan menggagalkan request utama jika gagal simpan ke DB.
 * - Tidak menyimpan password, token, atau rahasia.
 * - Otomatis mendeteksi IP dan User-Agent dari Express Request.
 */
export async function createAuditLog(options: CreateAuditLogOptions): Promise<void> {
  try {
    const userId = options.userId || (options.req as any)?.user?.id || (options.req as any)?.auth?.sub || null;
    const ipAddress = options.ipAddress || extractIpAddress(options.req);
    const userAgent = options.userAgent || extractUserAgent(options.req);
    const sanitizedMeta = options.metadata ? sanitizeMetadata(options.metadata) : null;

    await db.auditLog.create({
      data: {
        userId: userId ? String(userId) : null,
        action: String(options.action),
        entity: options.entity || null,
        entityId: options.entityId ? String(options.entityId) : null,
        metadata: sanitizedMeta,
        ipAddress: ipAddress ? String(ipAddress).slice(0, 100) : null,
        userAgent: userAgent ? String(userAgent) : null,
      },
    });
  } catch (error) {
    // Audit log tidak boleh menggagalkan proses bisnis utama
    console.error('AuditLog warning: Gagal mencatat log aktivitas:', error instanceof Error ? error.message : error);
  }
}

/**
 * Service untuk membaca dan memfilter audit logs (dengan pagination)
 */
export class AuditLogService {
  public async getLogs(params: AuditLogQueryParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.userId && params.userId.trim()) {
      where.userId = params.userId.trim();
    }

    if (params.action && params.action.trim()) {
      where.action = { contains: params.action.trim(), mode: 'insensitive' };
    }

    if (params.entity && params.entity.trim()) {
      where.entity = { contains: params.entity.trim(), mode: 'insensitive' };
    }

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        const start = new Date(params.startDate);
        if (!isNaN(start.getTime())) {
          where.createdAt.gte = start;
        }
      }
      if (params.endDate) {
        const end = new Date(params.endDate);
        if (!isNaN(end.getTime())) {
          // Tambahkan akhir hari jika hanya tanggal (YYYY-MM-DD)
          if (params.endDate.length === 10) {
            end.setHours(23, 59, 59, 999);
          }
          where.createdAt.lte = end;
        }
      }
    }

    const [total, logs] = await Promise.all([
      db.auditLog.count({ where }),
      db.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

