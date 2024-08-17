/*
  Warnings:

  - Added the required column `fromUserId` to the `shares` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `shares` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shares` DROP FOREIGN KEY `shares_idUser_fkey`;

-- AlterTable
ALTER TABLE `shares` ADD COLUMN `fromUserId` INTEGER NOT NULL,
    ADD COLUMN `toUserId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `shares` ADD CONSTRAINT `shares_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shares` ADD CONSTRAINT `shares_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
