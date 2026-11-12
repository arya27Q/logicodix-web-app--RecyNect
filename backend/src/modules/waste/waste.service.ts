import type { WasteCategory } from '../../types/index.js';
import { HttpError } from '../../utils/http-error.js';
import { WasteRepository } from './waste.repository.js';
import type { CreateCategoryInput, UpdateCategoryInput } from './waste.schemas.js';

function slugifyCategoryName(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base || 'kategori-sampah';
}

export class WasteService {
  private readonly wasteRepository = new WasteRepository();

  public async getCategories(): Promise<WasteCategory[]> {
    return this.wasteRepository.findActiveCategories();
  }

  public async getAllCategoriesForAdmin(): Promise<WasteCategory[]> {
    return this.wasteRepository.findAllCategories();
  }

  public async getCategoryById(id: string): Promise<WasteCategory> {
    const category = await this.wasteRepository.findById(id);
    if (!category) {
      throw new HttpError(404, 'Kategori sampah tidak ditemukan.');
    }
    return category;
  }

  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const base = slugifyCategoryName(name);
    if (!(await this.wasteRepository.slugExists(base, excludeId))) {
      return base;
    }

    for (let index = 2; index <= 50; index += 1) {
      const candidate = `${base}-${index}`;
      if (!(await this.wasteRepository.slugExists(candidate, excludeId))) {
        return candidate;
      }
    }

    return `${base}-${Date.now().toString().slice(-6)}`;
  }

  public async createCategory(payload: CreateCategoryInput): Promise<WasteCategory> {
    const existing = await this.wasteRepository.findByNameCaseInsensitive(payload.name);
    if (existing) {
      throw new HttpError(409, `Kategori "${payload.name}" sudah terdaftar.`);
    }

    const slug = await this.generateUniqueSlug(payload.name);
    return this.wasteRepository.createCategory({ ...payload, slug });
  }

  public async updateCategory(id: string, payload: UpdateCategoryInput): Promise<WasteCategory> {
    const existing = await this.wasteRepository.findRawById(id);
    if (!existing) {
      throw new HttpError(404, 'Kategori sampah tidak ditemukan.');
    }

    let nextSlug: string | undefined;
    if (payload.name !== undefined) {
      const duplicate = await this.wasteRepository.findByNameCaseInsensitive(payload.name, id);
      if (duplicate) {
        throw new HttpError(409, `Kategori "${payload.name}" sudah digunakan oleh kategori lain.`);
      }
      if (payload.name.trim() !== existing.name) {
        nextSlug = await this.generateUniqueSlug(payload.name, id);
      }
    }

    return this.wasteRepository.updateCategory(id, { ...payload, slug: nextSlug });
  }

  public async deleteCategory(id: string): Promise<void> {
    const existing = await this.wasteRepository.findRawById(id);
    if (!existing) {
      throw new HttpError(404, 'Kategori sampah tidak ditemukan.');
    }

    const { materials, items } = existing._count;
    if (materials > 0 || items > 0) {
      throw new HttpError(
        409,
        `Kategori tidak dapat dihapus karena masih terhubung dengan ${materials} ketentuan mitra dan ${items} riwayat pencocokan. Ubah status menjadi nonaktif sebagai gantinya.`,
      );
    }

    await this.wasteRepository.deleteCategory(id);
  }
}
