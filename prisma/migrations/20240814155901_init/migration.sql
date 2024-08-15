-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NOT NULL,
    `genre` ENUM('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE',
    `role` ENUM('TAILOR', 'USER', 'VENDOR') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NOT NULL,
    `credits` INTEGER NOT NULL DEFAULT 50,
    `vote` INTEGER NOT NULL DEFAULT 0,
    `role` ENUM('TAILOR', 'USER', 'VENDOR') NOT NULL DEFAULT 'TAILOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `actors_idUser_key`(`idUser`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `size` ENUM('XS', 'S', 'M', 'L', 'XL') NOT NULL DEFAULT 'M',
    `content` JSON NOT NULL,
    `idUser` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dislike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `idUser` INTEGER NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shares` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reposts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idPost` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `idUser` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follows` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idActor` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `follows_idActor_idUser_key`(`idActor`, `idUser`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PostToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PostToUser_AB_unique`(`A`, `B`),
    INDEX `_PostToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `actors` ADD CONSTRAINT `actors_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dislike` ADD CONSTRAINT `Dislike_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dislike` ADD CONSTRAINT `Dislike_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tags` ADD CONSTRAINT `tags_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shares` ADD CONSTRAINT `shares_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shares` ADD CONSTRAINT `shares_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reposts` ADD CONSTRAINT `reposts_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reposts` ADD CONSTRAINT `reposts_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vues` ADD CONSTRAINT `vues_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vues` ADD CONSTRAINT `vues_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produits` ADD CONSTRAINT `produits_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_idActor_fkey` FOREIGN KEY (`idActor`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToUser` ADD CONSTRAINT `_PostToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToUser` ADD CONSTRAINT `_PostToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
