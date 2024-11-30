/*
  Warnings:

  - You are about to drop the column `created_at` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `todos` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `todos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `todos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `todos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `todos` DROP FOREIGN KEY `todos_user_id_fkey`;

-- DropIndex
DROP INDEX `todos_completed_idx` ON `todos`;

-- DropIndex
DROP INDEX `users_email_idx` ON `users`;

-- AlterTable
ALTER TABLE `todos` DROP COLUMN `created_at`,
    DROP COLUMN `due_date`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `completedAt` DATETIME(3) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `todos` ADD CONSTRAINT `todos_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
