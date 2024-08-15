/*
  Warnings:

  - You are about to drop the `_StoryToVue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_StoryToVue` DROP FOREIGN KEY `_StoryToVue_A_fkey`;

-- DropForeignKey
ALTER TABLE `_StoryToVue` DROP FOREIGN KEY `_StoryToVue_B_fkey`;

-- DropForeignKey
ALTER TABLE `vues` DROP FOREIGN KEY `vues_idPost_fkey`;

-- DropForeignKey
ALTER TABLE `vues` DROP FOREIGN KEY `vues_idUser_fkey`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `vues` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `stories` ADD COLUMN `vues` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `_StoryToVue`;

-- DropTable
DROP TABLE `vues`;
