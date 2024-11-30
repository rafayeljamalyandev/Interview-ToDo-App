/*
  Warnings:

  - You are about to alter the column `title` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(120)`.

*/
-- AlterTable
ALTER TABLE `Todo` MODIFY `title` VARCHAR(120) NOT NULL;
