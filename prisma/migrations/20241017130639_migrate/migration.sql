/*
  Warnings:

  - You are about to drop the column `content` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `message` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "content",
ADD COLUMN     "message" TEXT NOT NULL;

-- DropTable
DROP TABLE "messages";
