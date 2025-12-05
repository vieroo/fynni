-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_credit_card_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "credit_card_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
