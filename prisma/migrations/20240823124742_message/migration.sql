/*
  Warnings:

  - You are about to drop the column `message` on the `chats` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ArticleState" AS ENUM ('PUBLISHED', 'DRAFT', 'DELETED');

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "message";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "state" "ArticleState" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "produits" ADD COLUMN     "state" "ArticleState" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "sender" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "text" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "chatId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
