/*
  Warnings:

  - You are about to drop the `_NotesToPost` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postId` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_NotesToPost` DROP FOREIGN KEY `_NotesToPost_A_fkey`;

-- DropForeignKey
ALTER TABLE `_NotesToPost` DROP FOREIGN KEY `_NotesToPost_B_fkey`;

-- AlterTable
ALTER TABLE `notes` ADD COLUMN `postId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_NotesToPost`;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
