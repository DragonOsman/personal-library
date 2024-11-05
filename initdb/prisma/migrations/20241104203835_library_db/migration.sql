-- CreateTable
CREATE TABLE `books` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `author` VARCHAR(255) NOT NULL,
    `publicationDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `addedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isbn` CHAR(13) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL DEFAULT '',
    `lastName` VARCHAR(255) NOT NULL DEFAULT '',
    `email` VARCHAR(230) NOT NULL DEFAULT '',
    `password` VARCHAR(255) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `readerId` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
