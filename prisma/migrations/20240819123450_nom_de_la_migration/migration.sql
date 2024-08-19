/*
  Warnings:

  - You are about to drop the column `idUser` on the `produits` table. All the data in the column will be lost.
  - Added the required column `idActor` to the `produits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_postId_fkey`;

-- DropForeignKey
ALTER TABLE `produits` DROP FOREIGN KEY `produits_idUser_fkey`;

-- AlterTable
ALTER TABLE `notes` ADD COLUMN `produitId` INTEGER NULL,
    MODIFY `postId` INTEGER NULL;

-- AlterTable
ALTER TABLE `produits` DROP COLUMN `idUser`,
    ADD COLUMN `idActor` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_produitId_fkey` FOREIGN KEY (`produitId`) REFERENCES `produits`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produits` ADD CONSTRAINT `produits_idActor_fkey` FOREIGN KEY (`idActor`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
