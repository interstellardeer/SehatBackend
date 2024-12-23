/*
 Navicat Premium Data Transfer

 Source Server         : Local
 Source Server Type    : MySQL
 Source Server Version : 100432
 Source Host           : localhost:3306
 Source Schema         : sehat

 Target Server Type    : MySQL
 Target Server Version : 100432
 File Encoding         : 65001

 Date: 23/12/2024 22:11:40
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for janji_temu
-- ----------------------------
DROP TABLE IF EXISTS `janji_temu`;
CREATE TABLE `janji_temu`  (
  `id_janji` int(11) NOT NULL AUTO_INCREMENT,
  `pasien_id` int(11) NULL DEFAULT NULL,
  `nakes_id` int(11) NULL DEFAULT NULL,
  `Tanggal_Janji` datetime(0) NOT NULL,
  `Status` enum('Terjadwal','Selesai','Dibatalkan') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'Terjadwal',
  PRIMARY KEY (`id_janji`) USING BTREE,
  INDEX `pasien_id`(`pasien_id`) USING BTREE,
  INDEX `nakes_id`(`nakes_id`) USING BTREE,
  CONSTRAINT `janji_temu_ibfk_1` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id_pasien`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `janji_temu_ibfk_2` FOREIGN KEY (`nakes_id`) REFERENCES `nakes` (`id_nakes`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of janji_temu
-- ----------------------------
INSERT INTO `janji_temu` VALUES (1, 1, 1, '2024-12-20 10:00:00', 'Terjadwal');
INSERT INTO `janji_temu` VALUES (2, 2, 2, '2024-12-21 11:00:00', 'Terjadwal');
INSERT INTO `janji_temu` VALUES (3, 3, 3, '2024-12-22 09:00:00', 'Selesai');
INSERT INTO `janji_temu` VALUES (4, 4, 4, '2024-12-23 14:00:00', 'Dibatalkan');
INSERT INTO `janji_temu` VALUES (5, 5, 1, '2024-12-24 08:30:00', 'Selesai');

-- ----------------------------
-- Table structure for klinik
-- ----------------------------
DROP TABLE IF EXISTS `klinik`;
CREATE TABLE `klinik`  (
  `id_klinik` int(11) NOT NULL AUTO_INCREMENT,
  `Nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Lokasi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Telepon` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Jam_Operasional` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Tanggal_Dibuat` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_klinik`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of klinik
-- ----------------------------
INSERT INTO `klinik` VALUES (1, 'Klinik Sehat Sentosa', 'Jl. Mawar No. 12', '081234567890', '08:00-20:00', '2024-12-23 20:46:51');
INSERT INTO `klinik` VALUES (2, 'Klinik Medika Utama', 'Jl. Melati No. 5', '081987654321', '09:00-18:00', '2024-12-23 20:46:51');
INSERT INTO `klinik` VALUES (3, 'Klinik Pratama Medika', 'Jl. Kenanga No. 8', '081345678901', '07:00-22:00', '2024-12-23 20:46:51');

-- ----------------------------
-- Table structure for nakes
-- ----------------------------
DROP TABLE IF EXISTS `nakes`;
CREATE TABLE `nakes`  (
  `id_nakes` int(11) NOT NULL AUTO_INCREMENT,
  `Nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Spesialisasi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Nomor_STR` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Jenis_Kelamin` enum('L','P') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Telepon` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `klinik_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id_nakes`) USING BTREE,
  INDEX `klinik_id`(`klinik_id`) USING BTREE,
  CONSTRAINT `nakes_ibfk_1` FOREIGN KEY (`klinik_id`) REFERENCES `klinik` (`id_klinik`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of nakes
-- ----------------------------
INSERT INTO `nakes` VALUES (1, 'Dr. Fitri Aulia', 'Dokter Umum', 'STR001', 'P', '081666666666', 'fitri@mail.com', 1);
INSERT INTO `nakes` VALUES (2, 'Dr. Gani Pratama', 'Dokter Gigi', 'STR002', 'L', '081777777777', 'gani@mail.com', 1);
INSERT INTO `nakes` VALUES (3, 'Dr. Hasan Basri', 'Dokter Anak', 'STR003', 'L', '081888888888', 'hasan@mail.com', 2);
INSERT INTO `nakes` VALUES (4, 'Dr. Intan Sari', 'Dokter Spesialis Kulit', 'STR004', 'P', '081999999999', 'intan@mail.com', 3);

-- ----------------------------
-- Table structure for obat
-- ----------------------------
DROP TABLE IF EXISTS `obat`;
CREATE TABLE `obat`  (
  `id_obat` int(11) NOT NULL AUTO_INCREMENT,
  `Nama_Obat` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Jenis_Obat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Harga` decimal(10, 2) NULL DEFAULT NULL,
  `Stok` int(11) NOT NULL,
  `Keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id_obat`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of obat
-- ----------------------------
INSERT INTO `obat` VALUES (1, 'Paracetamol', 'Tablet', 5000.00, 100, 'Obat penurun demam');
INSERT INTO `obat` VALUES (2, 'Ibuprofen', 'Tablet', 7500.00, 50, 'Obat anti nyeri');
INSERT INTO `obat` VALUES (3, 'Antasida', 'Syrup', 12000.00, 30, 'Obat maag');
INSERT INTO `obat` VALUES (4, 'Amoksisilin', 'Kapsul', 15000.00, 70, 'Antibiotik');
INSERT INTO `obat` VALUES (5, 'Vitamin C', 'Tablet', 2000.00, 200, 'Suplemen vitamin');

-- ----------------------------
-- Table structure for pasien
-- ----------------------------
DROP TABLE IF EXISTS `pasien`;
CREATE TABLE `pasien`  (
  `id_pasien` int(11) NOT NULL AUTO_INCREMENT,
  `Nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Tanggal_Lahir` date NOT NULL,
  `Jenis_Kelamin` enum('L','P') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Alamat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `No_Telepon` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Tanggal_Daftar` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pasien`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pasien
-- ----------------------------
INSERT INTO `pasien` VALUES (1, 'Andi Setiawan', '1990-01-01', 'L', 'Jl. Mangga No. 3', '081111111111', 'andi@mail.com', '2024-12-23 20:46:51');
INSERT INTO `pasien` VALUES (2, 'Budi Santoso', '1995-05-15', 'L', 'Jl. Apel No. 4', '081222222222', 'budi@mail.com', '2024-12-23 20:46:51');
INSERT INTO `pasien` VALUES (3, 'Citra Dewi', '1992-07-20', 'P', 'Jl. Anggur No. 5', '081333333333', 'citra@mail.com', '2024-12-23 20:46:51');
INSERT INTO `pasien` VALUES (4, 'Dewi Lestari', '1988-03-10', 'P', 'Jl. Durian No. 6', '081444444444', 'dewi@mail.com', '2024-12-23 20:46:51');
INSERT INTO `pasien` VALUES (5, 'Eko Priyanto', '1993-11-25', 'L', 'Jl. Rambutan No. 7', '081555555555', 'eko@mail.com', '2024-12-23 20:46:51');

-- ----------------------------
-- Table structure for pembayaran
-- ----------------------------
DROP TABLE IF EXISTS `pembayaran`;
CREATE TABLE `pembayaran`  (
  `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT,
  `kunjungan_id` int(11) NULL DEFAULT NULL,
  `Total_Bayar` decimal(10, 2) NULL DEFAULT NULL,
  `Metode_Bayar` enum('Tunai','Kartu Kredit','Transfer Bank','E-Wallet') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Status_Pembayaran` enum('Lunas','Belum Lunas') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'Belum Lunas',
  `Tanggal_Pembayaran` timestamp(0) NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id_pembayaran`) USING BTREE,
  INDEX `kunjungan_id`(`kunjungan_id`) USING BTREE,
  CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`kunjungan_id`) REFERENCES `riwayat_kunjungan` (`id_kunjungan`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pembayaran
-- ----------------------------
INSERT INTO `pembayaran` VALUES (1, 1, 150000.00, 'Tunai', 'Lunas', '2024-12-01 12:00:00');
INSERT INTO `pembayaran` VALUES (2, 2, 200000.00, 'Kartu Kredit', 'Lunas', '2024-12-01 13:30:00');
INSERT INTO `pembayaran` VALUES (3, 3, 100000.00, 'E-Wallet', 'Belum Lunas', '2024-12-23 20:46:52');
INSERT INTO `pembayaran` VALUES (4, 4, 250000.00, 'Transfer Bank', 'Lunas', '2024-12-03 16:00:00');
INSERT INTO `pembayaran` VALUES (5, 5, 300000.00, 'Tunai', 'Lunas', '2024-12-04 17:00:00');
INSERT INTO `pembayaran` VALUES (6, 1, 150000.00, 'Tunai', 'Lunas', '2024-12-01 12:00:00');
INSERT INTO `pembayaran` VALUES (7, 2, 200000.00, 'Kartu Kredit', 'Lunas', '2024-12-01 13:30:00');
INSERT INTO `pembayaran` VALUES (8, 3, 100000.00, 'E-Wallet', 'Belum Lunas', '2024-12-23 20:57:37');
INSERT INTO `pembayaran` VALUES (9, 4, 250000.00, 'Transfer Bank', 'Lunas', '2024-12-03 16:00:00');
INSERT INTO `pembayaran` VALUES (10, 5, 300000.00, 'Tunai', 'Lunas', '2024-12-04 17:00:00');

-- ----------------------------
-- Table structure for pengguna
-- ----------------------------
DROP TABLE IF EXISTS `pengguna`;
CREATE TABLE `pengguna`  (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `Nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Kata_Sandi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Peran` enum('Admin','Dokter','Pasien') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pasien_id` int(11) NULL DEFAULT NULL,
  `nakes_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id_user`) USING BTREE,
  UNIQUE INDEX `Email`(`Email`) USING BTREE,
  INDEX `pasien_id`(`pasien_id`) USING BTREE,
  INDEX `nakes_id`(`nakes_id`) USING BTREE,
  CONSTRAINT `pengguna_ibfk_1` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id_pasien`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pengguna_ibfk_2` FOREIGN KEY (`nakes_id`) REFERENCES `nakes` (`id_nakes`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for rekam_medis
-- ----------------------------
DROP TABLE IF EXISTS `rekam_medis`;
CREATE TABLE `rekam_medis`  (
  `id_rekam_medis` int(11) NOT NULL AUTO_INCREMENT,
  `kunjungan_id` int(11) NULL DEFAULT NULL,
  `Detail_Rekam_Medis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `Tanggal_Dibuat` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_rekam_medis`) USING BTREE,
  INDEX `kunjungan_id`(`kunjungan_id`) USING BTREE,
  CONSTRAINT `rekam_medis_ibfk_1` FOREIGN KEY (`kunjungan_id`) REFERENCES `riwayat_kunjungan` (`id_kunjungan`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for riwayat_kunjungan
-- ----------------------------
DROP TABLE IF EXISTS `riwayat_kunjungan`;
CREATE TABLE `riwayat_kunjungan`  (
  `id_kunjungan` int(11) NOT NULL AUTO_INCREMENT,
  `pasien_id` int(11) NULL DEFAULT NULL,
  `nakes_id` int(11) NULL DEFAULT NULL,
  `Tanggal_Kunjungan` datetime(0) NOT NULL,
  `Keluhan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `Diagnosa` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `klinik_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id_kunjungan`) USING BTREE,
  INDEX `pasien_id`(`pasien_id`) USING BTREE,
  INDEX `nakes_id`(`nakes_id`) USING BTREE,
  INDEX `klinik_id`(`klinik_id`) USING BTREE,
  CONSTRAINT `riwayat_kunjungan_ibfk_1` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id_pasien`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `riwayat_kunjungan_ibfk_2` FOREIGN KEY (`nakes_id`) REFERENCES `nakes` (`id_nakes`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `riwayat_kunjungan_ibfk_3` FOREIGN KEY (`klinik_id`) REFERENCES `klinik` (`id_klinik`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 51 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of riwayat_kunjungan
-- ----------------------------
INSERT INTO `riwayat_kunjungan` VALUES (1, 1, 1, '2024-12-01 10:00:00', 'Demam tinggi', 'Demam berdarah', 1);
INSERT INTO `riwayat_kunjungan` VALUES (2, 2, 2, '2024-12-01 11:00:00', 'Sakit gigi', 'Gigi berlubang', 1);
INSERT INTO `riwayat_kunjungan` VALUES (3, 3, 3, '2024-12-02 09:30:00', 'Batuk pilek', 'Infeksi saluran pernapasan atas', 2);
INSERT INTO `riwayat_kunjungan` VALUES (4, 4, 1, '2024-12-03 14:00:00', 'Pusing dan lemas', 'Anemia', 1);
INSERT INTO `riwayat_kunjungan` VALUES (5, 5, 4, '2024-12-04 16:00:00', 'Ruam kulit', 'Dermatitis kontak', 3);
INSERT INTO `riwayat_kunjungan` VALUES (6, 1, 3, '2024-12-05 08:30:00', 'Batuk berdarah', 'Tuberkulosis', 2);
INSERT INTO `riwayat_kunjungan` VALUES (7, 2, 4, '2024-12-06 13:00:00', 'Kulit kering dan gatal', 'Eksim', 3);
INSERT INTO `riwayat_kunjungan` VALUES (8, 3, 1, '2024-12-07 10:00:00', 'Nyeri perut', 'Gastritis', 1);
INSERT INTO `riwayat_kunjungan` VALUES (9, 4, 2, '2024-12-08 15:30:00', 'Gigi sensitif', 'Abrasi gigi', 1);
INSERT INTO `riwayat_kunjungan` VALUES (10, 5, 3, '2024-12-09 11:00:00', 'Sesak napas', 'Asma', 2);
INSERT INTO `riwayat_kunjungan` VALUES (11, 1, 3, '2024-12-05 08:30:00', 'Batuk berdarah', 'Tuberkulosis', 2);
INSERT INTO `riwayat_kunjungan` VALUES (12, 2, 4, '2024-12-06 13:00:00', 'Kulit kering dan gatal', 'Eksim', 3);
INSERT INTO `riwayat_kunjungan` VALUES (13, 3, 1, '2024-12-07 10:00:00', 'Nyeri perut', 'Gastritis', 1);
INSERT INTO `riwayat_kunjungan` VALUES (14, 4, 2, '2024-12-08 15:30:00', 'Gigi sensitif', 'Abrasi gigi', 1);
INSERT INTO `riwayat_kunjungan` VALUES (15, 5, 3, '2024-12-09 11:00:00', 'Sesak napas', 'Asma', 2);
INSERT INTO `riwayat_kunjungan` VALUES (16, 1, 4, '2024-12-10 08:30:00', 'Ruam kulit', 'Dermatitis', 3);
INSERT INTO `riwayat_kunjungan` VALUES (17, 2, 1, '2024-12-11 09:00:00', 'Demam tinggi', 'Malaria', 1);
INSERT INTO `riwayat_kunjungan` VALUES (18, 3, 2, '2024-12-12 14:00:00', 'Sakit kepala', 'Migrain', 1);
INSERT INTO `riwayat_kunjungan` VALUES (19, 4, 3, '2024-12-13 11:30:00', 'Batuk pilek', 'Bronkitis', 2);
INSERT INTO `riwayat_kunjungan` VALUES (20, 5, 4, '2024-12-14 10:00:00', 'Nyeri sendi', 'Artritis', 3);
INSERT INTO `riwayat_kunjungan` VALUES (21, 1, 2, '2024-12-15 13:00:00', 'Pusing', 'Vertigo', 1);
INSERT INTO `riwayat_kunjungan` VALUES (22, 2, 3, '2024-12-16 15:00:00', 'Nyeri otot', 'Mialgia', 2);
INSERT INTO `riwayat_kunjungan` VALUES (23, 3, 4, '2024-12-17 09:30:00', 'Ruam merah', 'Psoriasis', 3);
INSERT INTO `riwayat_kunjungan` VALUES (24, 4, 1, '2024-12-18 16:00:00', 'Sakit perut', 'Dispepsia', 1);
INSERT INTO `riwayat_kunjungan` VALUES (25, 5, 2, '2024-12-19 10:30:00', 'Sulit bernapas', 'Pneumonia', 2);
INSERT INTO `riwayat_kunjungan` VALUES (26, 1, 3, '2024-12-20 14:30:00', 'Kulit terasa panas', 'Sunburn', 3);
INSERT INTO `riwayat_kunjungan` VALUES (27, 2, 4, '2024-12-21 11:00:00', 'Batuk kronis', 'Kanker paru', 1);
INSERT INTO `riwayat_kunjungan` VALUES (28, 3, 1, '2024-12-22 08:00:00', 'Luka bakar ringan', 'Luka bakar derajat 1', 2);
INSERT INTO `riwayat_kunjungan` VALUES (29, 4, 2, '2024-12-23 13:30:00', 'Pendarahan gusi', 'Gingivitis', 1);
INSERT INTO `riwayat_kunjungan` VALUES (30, 5, 3, '2024-12-24 09:00:00', 'Nyeri telinga', 'Otitis media', 2);
INSERT INTO `riwayat_kunjungan` VALUES (31, 1, 4, '2024-12-25 15:00:00', 'Gangguan tidur', 'Insomnia', 3);
INSERT INTO `riwayat_kunjungan` VALUES (32, 2, 1, '2024-12-26 08:30:00', 'Sakit leher', 'Torticollis', 1);
INSERT INTO `riwayat_kunjungan` VALUES (33, 3, 2, '2024-12-27 14:00:00', 'Nyeri dada', 'Angina', 2);
INSERT INTO `riwayat_kunjungan` VALUES (34, 4, 3, '2024-12-28 11:00:00', 'Kesemutan', 'Neuropati', 3);
INSERT INTO `riwayat_kunjungan` VALUES (35, 5, 4, '2024-12-29 09:30:00', 'Mata merah', 'Konjungtivitis', 1);
INSERT INTO `riwayat_kunjungan` VALUES (36, 1, 2, '2024-12-30 10:30:00', 'Luka terbuka', 'Infeksi luka', 2);
INSERT INTO `riwayat_kunjungan` VALUES (37, 2, 3, '2024-12-31 08:00:00', 'Sakit punggung', 'Herniated disc', 3);
INSERT INTO `riwayat_kunjungan` VALUES (38, 3, 4, '2025-01-01 13:00:00', 'Nyeri lutut', 'Osteoartritis', 1);
INSERT INTO `riwayat_kunjungan` VALUES (39, 4, 1, '2025-01-02 15:00:00', 'Ruam gatal', 'Alergi kulit', 3);
INSERT INTO `riwayat_kunjungan` VALUES (40, 5, 2, '2025-01-03 09:30:00', 'Gusi berdarah', 'Periodontitis', 1);
INSERT INTO `riwayat_kunjungan` VALUES (41, 1, 3, '2025-01-04 14:30:00', 'Lemas berlebihan', 'Anemia berat', 2);
INSERT INTO `riwayat_kunjungan` VALUES (42, 2, 4, '2025-01-05 08:00:00', 'Gangguan menelan', 'Disfagia', 3);
INSERT INTO `riwayat_kunjungan` VALUES (43, 3, 1, '2025-01-06 11:00:00', 'Batuk darah', 'Kanker tenggorokan', 2);
INSERT INTO `riwayat_kunjungan` VALUES (44, 4, 2, '2025-01-07 15:30:00', 'Sakit gigi', 'Abses gigi', 1);
INSERT INTO `riwayat_kunjungan` VALUES (45, 5, 3, '2025-01-08 09:00:00', 'Nyeri kaki', 'Fraktur ringan', 3);
INSERT INTO `riwayat_kunjungan` VALUES (46, 1, 4, '2025-01-09 10:00:00', 'Infeksi kulit', 'Selulitis', 2);
INSERT INTO `riwayat_kunjungan` VALUES (47, 2, 1, '2025-01-10 13:30:00', 'Gatal kronis', 'Pruritus', 1);
INSERT INTO `riwayat_kunjungan` VALUES (48, 3, 2, '2025-01-11 14:30:00', 'Pembengkakan kaki', 'Edema', 3);
INSERT INTO `riwayat_kunjungan` VALUES (49, 4, 3, '2025-01-12 11:30:00', 'Luka bernanah', 'Infeksi bakteri', 2);
INSERT INTO `riwayat_kunjungan` VALUES (50, 5, 4, '2025-01-13 08:30:00', 'Sakit perut hebat', 'Radang usus buntu', 1);

SET FOREIGN_KEY_CHECKS = 1;
