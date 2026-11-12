import type { Request } from 'express';

export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  MATCHING_CREATED: 'MATCHING_CREATED',
  DELIVERY_CREATED: 'DELIVERY_CREATED',
  DELIVERY_UPDATED: 'DELIVERY_UPDATED',
  PRICE_HISTORY_CREATED: 'PRICE_HISTORY_CREATED',
  MATERIAL_CREATED: 'MATERIAL_CREATED',
  MATERIAL_UPDATED: 'MATERIAL_UPDATED',
  MATERIAL_DELETED: 'MATERIAL_DELETED',
  RECYCLER_VERIFIED: 'RECYCLER_VERIFIED',
  RECYCLER_STATUS_UPDATED: 'RECYCLER_STATUS_UPDATED',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS] | string;

export interface CreateAuditLogOptions {
  req?: Request;
  userId?: string | null;
  action: AuditAction;
  entity?: string | null;
  entityId?: string | null;
  metadata?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
}
