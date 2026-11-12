import { Request, Response } from 'express';
import { RecyclerService } from './recycler.service.js';
import { sendSuccess } from '../../utils/api-response.js';
import { HttpError } from '../../utils/http-error.js';
import { db } from '../../config/database.js';
import { createAuditLog } from '../audit-logs/audit-log.service.js';
import { AUDIT_ACTIONS } from '../audit-logs/audit-log.types.js';

export class RecyclerController {
  private recyclerService: RecyclerService;

  constructor() {
    this.recyclerService = new RecyclerService();
  }

  public getAll = async (req: Request, res: Response) => {
    const recyclers = await this.recyclerService.getAll();
    return sendSuccess(res, recyclers, 'Berhasil memuat daftar pengelola');
  };

  public getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const recycler = await this.recyclerService.getById(id);
    return sendSuccess(res, recycler, 'Berhasil memuat detail pengelola');
  };

  public getMyMaterials = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      throw new HttpError(401, 'Autentikasi diperlukan.');
    }
    const materials = await this.recyclerService.getMyMaterials(userId);
    return sendSuccess(res, materials, 'Berhasil memuat ketentuan material mitra');
  };

  public createMaterial = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      throw new HttpError(401, 'Autentikasi diperlukan.');
    }
    const { categoryId, name, category, price, unit, minQuantity, qualityRequirements, isAvailable } = req.body;
    if (!categoryId && !name && !category) {
      throw new HttpError(400, 'Nama atau kategori material wajib diisi.');
    }
    if (price === undefined || Number(price) <= 0) {
      throw new HttpError(400, 'Harga beli material harus lebih besar dari 0.');
    }

    const created = await this.recyclerService.addMaterial(userId, {
      categoryId,
      name,
      category,
      price: Number(price),
      unit,
      minQuantity: minQuantity !== undefined ? Number(minQuantity) : 0,
      qualityRequirements,
      isAvailable,
    });

    await createAuditLog({
      req,
      userId,
      action: AUDIT_ACTIONS.MATERIAL_CREATED,
      entity: 'RecyclerMaterial',
      entityId: (created as any)?.id,
      metadata: { price: Number(price), unit, categoryId: (created as any)?.categoryId },
    });

    await createAuditLog({
      req,
      userId,
      action: AUDIT_ACTIONS.PRICE_HISTORY_CREATED,
      entity: 'PriceHistory',
      entityId: (created as any)?.id,
      metadata: { newPrice: Number(price), unit },
    });

    return sendSuccess(res, created, 'Berhasil menambahkan material baru ke katalog', 201);
  };

  public updateMaterial = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      throw new HttpError(401, 'Autentikasi diperlukan.');
    }
    const materialId = req.params.id as string;
    const { name, price, unit, minQuantity, qualityRequirements, isAvailable } = req.body;

    const updated = await this.recyclerService.updateMaterial(userId, materialId, {
      name,
      price: price !== undefined ? Number(price) : undefined,
      unit,
      minQuantity: minQuantity !== undefined ? Number(minQuantity) : undefined,
      qualityRequirements,
      isAvailable,
    });

    await createAuditLog({
      req,
      userId,
      action: AUDIT_ACTIONS.MATERIAL_UPDATED,
      entity: 'RecyclerMaterial',
      entityId: materialId,
      metadata: { price, unit, isAvailable },
    });

    if (price !== undefined) {
      await createAuditLog({
        req,
        userId,
        action: AUDIT_ACTIONS.PRICE_HISTORY_CREATED,
        entity: 'PriceHistory',
        entityId: materialId,
        metadata: { newPrice: Number(price) },
      });
    }

    return sendSuccess(res, updated, 'Berhasil memperbarui ketentuan material');
  };

  public deleteMaterial = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      throw new HttpError(401, 'Autentikasi diperlukan.');
    }
    const materialId = req.params.id as string;
    await this.recyclerService.deleteMaterial(userId, materialId);

    await createAuditLog({
      req,
      userId,
      action: AUDIT_ACTIONS.MATERIAL_DELETED,
      entity: 'RecyclerMaterial',
      entityId: materialId,
    });

    return sendSuccess(res, { id: materialId }, 'Material berhasil dihapus dari ketentuan penerimaan');
  };

  public getDashboardStats = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      throw new HttpError(401, 'Autentikasi diperlukan.');
    }
    const stats = await this.recyclerService.getDashboardStats(userId);
    return sendSuccess(res, stats, 'Berhasil memuat ringkasan statistik operasional gudang');
  };

  public getIncomingDeliveries = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      throw new HttpError(401, 'Autentikasi diperlukan.');
    }
    const deliveries = await this.recyclerService.getIncomingDeliveries(userId);
    return sendSuccess(res, deliveries, 'Berhasil memuat daftar setoran masuk');
  };

  public updateDeliveryStatus = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      throw new HttpError(401, 'Autentikasi diperlukan.');
    }
    const deliveryId = req.params.id as string;
    const { status, actualWeight, actualPayoutRp, notes } = req.body;

    const updated = await this.recyclerService.updateDeliveryStatus(userId, deliveryId, {
      status,
      actualWeight: actualWeight !== undefined ? Number(actualWeight) : undefined,
      actualPayoutRp: actualPayoutRp !== undefined ? Number(actualPayoutRp) : undefined,
      notes,
    });

    await createAuditLog({
      req,
      userId,
      action: AUDIT_ACTIONS.DELIVERY_UPDATED,
      entity: 'IncomingDelivery',
      entityId: deliveryId,
      metadata: { status, actualWeight, actualPayoutRp },
    });

    return sendSuccess(res, updated, 'Status setoran berhasil diperbarui');
  };

  public scheduleIncomingDelivery = async (req: Request, res: Response) => {
    let citizenId = (req as any).user?.id || req.auth?.sub;
    const {
      recyclerId,
      sessionId,
      citizenName,
      citizenPhone,
      materials,
      totalEstimatedWeight,
      estimatedPayoutRp,
      arrivalTime,
      notes,
    } = req.body;

    // Hubungkan otomatis ke akun user jika nomor HP atau nama terdaftar
    if (!citizenId && (citizenPhone || citizenName)) {
      try {
        const matchedUser = await db.user.findFirst({
          where: {
            OR: [
              ...(citizenPhone ? [{ phone: citizenPhone }] : []),
              ...(citizenName ? [{ name: citizenName }] : []),
            ],
          },
        });
        if (matchedUser) {
          citizenId = matchedUser.id;
        }
      } catch {
        // Abaikan jika query gagal
      }
    }

    const created = await this.recyclerService.scheduleIncomingDelivery({
      recyclerId,
      citizenId,
      sessionId,
      citizenName,
      citizenPhone,
      materials: materials || [],
      totalEstimatedWeight: totalEstimatedWeight || '0 kg',
      estimatedPayoutRp: Number(estimatedPayoutRp || 0),
      arrivalTime: arrivalTime || 'Hari Ini',
      notes,
    });

    await createAuditLog({
      req,
      userId: citizenId || null,
      action: AUDIT_ACTIONS.DELIVERY_CREATED,
      entity: 'IncomingDelivery',
      entityId: (created as any)?.id || (created as any)?.deliveryCode,
      metadata: {
        deliveryCode: (created as any)?.deliveryCode,
        recyclerId,
        estimatedPayoutRp: Number(estimatedPayoutRp || 0),
      },
    });

    return sendSuccess(res, created, 'Jadwal setoran berhasil dikonfirmasi ke pengelola gudang', 201);
  };
}
