-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NULL,
    `no_hp` VARCHAR(191) NULL,
    `tanggal_lahir` DATETIME(3) NULL,
    `alamat` VARCHAR(191) NULL,
    `foto_profil` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_profile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_predict` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pemilik` VARCHAR(191) NOT NULL,
    `no_plat` VARCHAR(191) NOT NULL,
    `engine_size` DOUBLE NOT NULL,
    `cylinders` DOUBLE NOT NULL,
    `fuel_consumption_city` DOUBLE NOT NULL,
    `fuel_consumption_hwy` DOUBLE NOT NULL,
    `fuel_consumption_comb` DOUBLE NOT NULL,
    `fuel_consumption_comb_mpg` DOUBLE NOT NULL,
    `emisi` DOUBLE NOT NULL,
    `prediksi` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `tipe_kendaraan_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipe_kendaraan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipe` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emission_predict` ADD CONSTRAINT `emission_predict_tipe_kendaraan_id_fkey` FOREIGN KEY (`tipe_kendaraan_id`) REFERENCES `tipe_kendaraan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
