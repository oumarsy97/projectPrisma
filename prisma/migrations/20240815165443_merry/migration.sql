-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_idUser_fkey`;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
