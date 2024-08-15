/*
  Warnings:

  - Added the required column `qte` to the `produits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produits` ADD COLUMN `qte` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ventes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idActor` INTEGER NOT NULL,
    `idProduit` INTEGER NOT NULL,
    `idUser` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commandes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idProduit` INTEGER NOT NULL,
    `montant` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commande_produits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCommande` INTEGER NOT NULL,
    `idProduit` INTEGER NOT NULL,
    `qte` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,

    UNIQUE INDEX `commande_produits_idProduit_idCommande_key`(`idProduit`, `idCommande`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idActory` INTEGER NOT NULL,
    `photo` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `credit` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'USED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idActor` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CommentToStory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CommentToStory_AB_unique`(`A`, `B`),
    INDEX `_CommentToStory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StoryToVue` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StoryToVue_AB_unique`(`A`, `B`),
    INDEX `_StoryToVue_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ventes` ADD CONSTRAINT `ventes_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ventes` ADD CONSTRAINT `ventes_idActor_fkey` FOREIGN KEY (`idActor`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ventes` ADD CONSTRAINT `ventes_idProduit_fkey` FOREIGN KEY (`idProduit`) REFERENCES `produits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commandes` ADD CONSTRAINT `commandes_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commande_produits` ADD CONSTRAINT `commande_produits_idCommande_fkey` FOREIGN KEY (`idCommande`) REFERENCES `commandes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commande_produits` ADD CONSTRAINT `commande_produits_idProduit_fkey` FOREIGN KEY (`idProduit`) REFERENCES `produits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_idActory_fkey` FOREIGN KEY (`idActory`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_idActor_fkey` FOREIGN KEY (`idActor`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CommentToStory` ADD CONSTRAINT `_CommentToStory_A_fkey` FOREIGN KEY (`A`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CommentToStory` ADD CONSTRAINT `_CommentToStory_B_fkey` FOREIGN KEY (`B`) REFERENCES `stories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StoryToVue` ADD CONSTRAINT `_StoryToVue_A_fkey` FOREIGN KEY (`A`) REFERENCES `stories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StoryToVue` ADD CONSTRAINT `_StoryToVue_B_fkey` FOREIGN KEY (`B`) REFERENCES `vues`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
