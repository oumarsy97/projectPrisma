/*
  Warnings:

  - You are about to drop the column `idUser` on the `shares` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `shares_idUser_fkey` ON `shares`;

-- AlterTable
ALTER TABLE `shares` DROP COLUMN `idUser`;
