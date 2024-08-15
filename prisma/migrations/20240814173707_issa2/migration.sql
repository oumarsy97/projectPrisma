/*
  Warnings:

  - You are about to drop the column `idUser` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `_CommentToStory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idActor` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_CommentToStory` DROP FOREIGN KEY `_CommentToStory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CommentToStory` DROP FOREIGN KEY `_CommentToStory_B_fkey`;

-- DropForeignKey
ALTER TABLE `_PostToUser` DROP FOREIGN KEY `_PostToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PostToUser` DROP FOREIGN KEY `_PostToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_idPost_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_idUser_fkey`;

-- AlterTable
ALTER TABLE `comments` ADD COLUMN `idStory` INTEGER NULL,
    MODIFY `idPost` INTEGER NULL;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `idUser`,
    ADD COLUMN `idActor` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_CommentToStory`;

-- DropTable
DROP TABLE `_PostToUser`;

-- CreateTable
CREATE TABLE `Favori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Favori` ADD CONSTRAINT `Favori_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favori` ADD CONSTRAINT `Favori_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_idActor_fkey` FOREIGN KEY (`idActor`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_idStory_fkey` FOREIGN KEY (`idStory`) REFERENCES `stories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
