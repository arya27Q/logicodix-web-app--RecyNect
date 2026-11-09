-- =======================================================
-- Database DDL Schema untuk RecyNect (MySQL)
-- Kompatibel dengan MySQL 8.x / MariaDB 10.x
-- =======================================================

CREATE DATABASE IF NOT EXISTS `RecyNect` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `RecyNect`;

-- 1. Tabel users (Masyarakat & Akun Pengelola)
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `role` ENUM('user', 'recycler', 'admin') NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel admins (Internal Administrator & Auditor)
CREATE TABLE IF NOT EXISTS `admins` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel recyclers (Direktori & Profil Mitra Pengelola)
CREATE TABLE IF NOT EXISTS `recyclers` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `name` VARCHAR(150) NOT NULL,
    `management_type` ENUM('bank_sampah', 'pengepul', 'tps3r', 'recycler_industry') NOT NULL,
    `description` TEXT NULL,
    `address` TEXT NOT NULL,
    `latitude` DECIMAL(10, 7) NOT NULL,
    `longitude` DECIMAL(10, 7) NOT NULL,
    `contact` VARCHAR(50) NOT NULL,
    `operating_hours` VARCHAR(150) NULL,
    `verification_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    `is_demo` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT `recyclers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel waste_categories (Informasi Master Jenis Sampah)
CREATE TABLE IF NOT EXISTS `waste_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NULL,
    `unit` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `waste_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel recycler_materials (Ketentuan Harga, Minimum Setoran, Syarat Mutu)
CREATE TABLE IF NOT EXISTS `recycler_materials` (
    `id` VARCHAR(191) NOT NULL,
    `recycler_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `min_quantity` DECIMAL(8, 2) NOT NULL DEFAULT 0,
    `quality_requirements` TEXT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,
    `price_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `recycler_materials_recycler_id_category_id_key`(`recycler_id`, `category_id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `recycler_materials_recycler_id_fkey` FOREIGN KEY (`recycler_id`) REFERENCES `recyclers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `recycler_materials_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `waste_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel matching_sessions (Sesi Pencarian Pengguna & Lokasi)
CREATE TABLE IF NOT EXISTS `matching_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `latitude` DECIMAL(10, 7) NOT NULL,
    `longitude` DECIMAL(10, 7) NOT NULL,
    `priority` ENUM('balanced', 'highest_value', 'nearest', 'fewest_stops') NOT NULL DEFAULT 'balanced',
    `search_radius` DECIMAL(6, 2) NOT NULL DEFAULT 30.00,
    `status` VARCHAR(50) NOT NULL DEFAULT 'completed',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT `matching_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel matching_items (Input Beberapa Jenis Sampah Sekaligus)
CREATE TABLE IF NOT EXISTS `matching_items` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(8, 2) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `condition` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT `matching_items_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `matching_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `matching_items_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `waste_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel matching_results (Hasil Optimasi & Ranking Kombinasi Pengelola)
CREATE TABLE IF NOT EXISTS `matching_results` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `rank` INT NOT NULL,
    `total_value` DECIMAL(12, 2) NOT NULL,
    `total_distance` DECIMAL(8, 2) NOT NULL,
    `total_stops` INT NOT NULL,
    `economy_score` DECIMAL(5, 2) NOT NULL,
    `distance_score` DECIMAL(5, 2) NOT NULL,
    `stops_score` DECIMAL(5, 2) NOT NULL,
    `final_score` DECIMAL(5, 2) NOT NULL,
    `unmatched_summary` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    CONSTRAINT `matching_results_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `matching_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabel matching_assignments (Snapshot Penempatan Material & Transparansi Harga)
CREATE TABLE IF NOT EXISTS `matching_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `result_id` VARCHAR(191) NOT NULL,
    `matching_item_id` VARCHAR(191) NOT NULL,
    `recycler_material_id` VARCHAR(191) NOT NULL,
    `quantity_snapshot` DECIMAL(8, 2) NOT NULL,
    `price_snapshot` DECIMAL(12, 2) NOT NULL,
    `estimated_value` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    CONSTRAINT `matching_assignments_result_id_fkey` FOREIGN KEY (`result_id`) REFERENCES `matching_results`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `matching_assignments_matching_item_id_fkey` FOREIGN KEY (`matching_item_id`) REFERENCES `matching_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `matching_assignments_recycler_material_id_fkey` FOREIGN KEY (`recycler_material_id`) REFERENCES `recycler_materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabel price_histories (Audit Perubahan Harga Usang)
CREATE TABLE IF NOT EXISTS `price_histories` (
    `id` VARCHAR(191) NOT NULL,
    `recycler_material_id` VARCHAR(191) NOT NULL,
    `old_price` DECIMAL(12, 2) NOT NULL,
    `new_price` DECIMAL(12, 2) NOT NULL,
    `changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    CONSTRAINT `price_histories_recycler_material_id_fkey` FOREIGN KEY (`recycler_material_id`) REFERENCES `recycler_materials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

