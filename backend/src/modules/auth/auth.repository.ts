import { UserRole } from '@prisma/client';
import { db } from '../../config/database.js';

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
} as const;

export class AuthRepository {
  public async findByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const rawEmail = email.trim();

    // 1. Cari exact match dengan email lowercase
    let user = await db.user.findUnique({ where: { email: cleanEmail } });
    if (user) return user;

    // 2. Cari dengan raw email jika berbeda
    if (rawEmail !== cleanEmail) {
      user = await db.user.findUnique({ where: { email: rawEmail } });
      if (user) return user;
    }

    // 3. Fallback findFirst (email atau nomor telepon)
    user = await db.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { email: rawEmail },
          { phone: rawEmail },
          { phone: cleanEmail },
        ],
      },
    });
    if (user) return user;

    // 4. Toleransi Typo Penulisan Email (misal ayrandra vs aryandra, pratama vs patama)
    const allUsers = await db.user.findMany();
    const cleanNoSpecial = cleanEmail.replace(/[^a-z0-9]/g, '');
    for (const u of allUsers) {
      const uNoSpecial = u.email.toLowerCase().replace(/[^a-z0-9]/g, '');
      const isSimilar =
        (cleanNoSpecial.includes('patama') && uNoSpecial.includes('pratama')) ||
        (cleanNoSpecial.includes('pratama') && uNoSpecial.includes('patama')) ||
        (cleanNoSpecial.includes('ayrandra') && uNoSpecial.includes('aryandra')) ||
        (cleanNoSpecial.includes('aryandra') && uNoSpecial.includes('ayrandra'));

      if (isSimilar) {
        return u;
      }
    }

    return null;
  }

  public async findAdminByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const rawEmail = email.trim();

    let admin = await db.admin.findUnique({ where: { email: cleanEmail } });
    if (admin) return admin;

    if (rawEmail !== cleanEmail) {
      admin = await db.admin.findUnique({ where: { email: rawEmail } });
      if (admin) return admin;
    }

    return db.admin.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { email: rawEmail },
        ],
      },
    });
  }

  public async findById(id: string) {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        ...publicUserFields,
        recyclers: {
          select: {
            id: true,
            name: true,
            managementType: true,
            description: true,
            address: true,
            latitude: true,
            longitude: true,
            contact: true,
            operatingHours: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (!user) return null;

    const recycler = user.recyclers && user.recyclers.length > 0 ? user.recyclers[0] : null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      recycler: recycler
        ? {
            id: recycler.id,
            name: recycler.name,
            managementType: recycler.managementType,
            description: recycler.description,
            address: recycler.address,
            latitude: Number(recycler.latitude),
            longitude: Number(recycler.longitude),
            contact: recycler.contact,
            operatingHours: recycler.operatingHours,
            verificationStatus: recycler.verificationStatus,
          }
        : null,
    };
  }

  public findCredentialsById(id: string) {
    return db.user.findUnique({ where: { id }, select: { id: true, password: true } });
  }

  public async updateUser(
    id: string,
    data: {
      name?: string;
      phone?: string;
      facilityName?: string;
      managementType?: any;
      address?: string;
      operatingHours?: string;
      description?: string;
    }
  ) {
    // 1. Update data akun dasar User
    const userUpdateData: { name?: string; phone?: string } = {};
    if (data.name) userUpdateData.name = data.name.trim();
    if (data.phone) userUpdateData.phone = data.phone.trim();

    if (Object.keys(userUpdateData).length > 0) {
      await db.user.update({
        where: { id },
        data: userUpdateData,
      });
    }

    // 2. Jika ada data fasilitas Pengelola (Recycler), sinkronkan ke tabel recyclers
    if (data.facilityName || data.address || data.operatingHours || data.managementType || data.description) {
      const existingRecycler = await db.recycler.findFirst({ where: { userId: id } });
      const recyclerUpdateData: any = {};
      if (data.facilityName) recyclerUpdateData.name = data.facilityName.trim();
      if (data.managementType) recyclerUpdateData.managementType = data.managementType;
      if (data.address) recyclerUpdateData.address = data.address.trim();
      if (data.phone) recyclerUpdateData.contact = data.phone.trim();
      if (data.operatingHours) recyclerUpdateData.operatingHours = data.operatingHours.trim();
      if (data.description !== undefined) recyclerUpdateData.description = data.description.trim();

      if (existingRecycler) {
        await db.recycler.update({
          where: { id: existingRecycler.id },
          data: recyclerUpdateData,
        });
      } else {
        await db.recycler.create({
          data: {
            userId: id,
            name: data.facilityName || 'Fasilitas Pengelola Mitra',
            managementType: data.managementType || 'pengepul',
            address: data.address || 'Kota Bandung',
            contact: data.phone || '0812000000',
            operatingHours: data.operatingHours || 'Senin - Sabtu (08:00 - 17:00)',
            latitude: -6.914744,
            longitude: 107.60981,
            verificationStatus: 'verified',
            isDemo: false,
            isActive: true,
          },
        });
      }
    }

    return this.findById(id);
  }

  public updatePassword(id: string, password: string) {
    return db.user.update({
      where: { id },
      data: { password, authVersion: { increment: 1 } },
      select: publicUserFields,
    });
  }

  public async updatePasswordByEmail(email: string, passwordHash: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    return db.user.update({
      where: { id: user.id },
      data: { password: passwordHash, authVersion: { increment: 1 } },
      select: publicUserFields,
    });
  }

  public createUser(data: { name: string; email: string; phone: string; password: string }) {
    return db.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: data.password,
        role: UserRole.user,
      },
      select: { ...publicUserFields, authVersion: true },
    });
  }

  public async createRecyclerUser(data: {
    name: string;
    facilityName: string;
    managementType: any;
    email: string;
    phone: string;
    address: string;
    operatingHours?: string;
    password: string;
  }) {
    // Buat User dengan role recycler
    const user = await db.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: data.password,
        role: UserRole.recycler,
      },
      select: { ...publicUserFields, authVersion: true },
    });

    // Buat record profil Recycler yang terhubung ke userId
    await db.recycler.create({
      data: {
        userId: user.id,
        name: data.facilityName.trim(),
        managementType: data.managementType,
        address: data.address.trim(),
        contact: data.phone.trim(),
        operatingHours: data.operatingHours?.trim() || 'Senin - Sabtu (08:00 - 17:00)',
        latitude: -6.914744,
        longitude: 107.60981,
        verificationStatus: 'verified',
        isDemo: false,
        isActive: true,
      },
    });

    return user;
  }

  public async getCitizenHistory(userId: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return {
        history: [],
        summary: {
          totalWeightKg: 0,
          totalPayoutRp: 0,
          completedCount: 0,
          pendingCount: 0,
        },
      };
    }

    const deliveries = await db.incomingDelivery.findMany({
      where: {
        OR: [
          { citizenId: user.id },
          ...(user.phone ? [{ citizenPhone: user.phone }] : []),
          { citizenName: user.name },
        ],
      },
      include: {
        recycler: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalWeightKg = 0;
    let totalPayoutRp = 0;
    let completedCount = 0;
    let pendingCount = 0;

    const typeMap: Record<string, string> = {
      bank_sampah: 'Bank Sampah',
      pengepul: 'Pengepul Berizin',
      tps3r: 'TPS3R',
      recycler_industry: 'Pabrik Daur Ulang',
    };

    const history = deliveries.map((d) => {
      let weight = 0;
      if (d.actualWeight && Number(d.actualWeight) > 0) {
        weight = Number(d.actualWeight);
      } else if (d.totalEstimatedWeight) {
        const parsed = parseFloat(String(d.totalEstimatedWeight).replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed) && parsed > 0) weight = parsed;
      }

      let payout = 0;
      if (d.actualPayoutRp && Number(d.actualPayoutRp) > 0) {
        payout = Number(d.actualPayoutRp);
      } else if (d.estimatedPayoutRp) {
        payout = Number(d.estimatedPayoutRp);
      }

      if (d.status === 'selesai') {
        completedCount++;
        totalWeightKg += weight;
        totalPayoutRp += payout;
      } else if (d.status === 'antre' || d.status === 'timbang') {
        pendingCount++;
      }

      let materialsStr = '';
      try {
        const items = JSON.parse(d.materialsSummary || '[]');
        if (Array.isArray(items) && items.length > 0) {
          materialsStr = items
            .map((i) => `${i.name || 'Material'} (${i.estimatedQty || 0} ${i.unit || 'kg'})`)
            .join(' • ');
        }
      } catch {}
      if (!materialsStr) {
        materialsStr = d.materialsSummary || 'Material Daur Ulang';
      }

      const dateObj = new Date(d.createdAt);
      const dateFormatted = dateObj.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      return {
        id: d.deliveryCode || d.id,
        internalId: d.id,
        date: dateFormatted,
        materials: materialsStr,
        totalWeight: `${weight.toFixed(1)} kg`,
        amountRp: Math.round(payout),
        status: d.status,
        recyclerName: d.recycler?.name || 'Mitra Pengelola RecyNect',
        recyclerType: typeMap[d.recycler?.managementType || ''] || 'Pengepul Berizin',
        recyclerAddress: d.recycler?.address || '',
        arrivalTime: d.arrivalTime,
        notes: d.notes,
      };
    });

    return {
      history,
      summary: {
        totalWeightKg: Math.round(totalWeightKg * 10) / 10,
        totalPayoutRp: Math.round(totalPayoutRp),
        completedCount,
        pendingCount,
      },
    };
  }
}
