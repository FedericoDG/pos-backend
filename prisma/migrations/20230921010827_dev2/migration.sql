-- AlterTable
ALTER TABLE `cash_movements` ADD COLUMN `discountPercent` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `rechargePercent` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `discount` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `recharge` DOUBLE NOT NULL DEFAULT 0;
