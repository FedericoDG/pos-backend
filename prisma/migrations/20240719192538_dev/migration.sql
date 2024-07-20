-- AlterTable
ALTER TABLE `current_account_details` ADD COLUMN `cashMovementId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `current_account_details` ADD CONSTRAINT `current_account_details_cashMovementId_fkey` FOREIGN KEY (`cashMovementId`) REFERENCES `cash_movements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
