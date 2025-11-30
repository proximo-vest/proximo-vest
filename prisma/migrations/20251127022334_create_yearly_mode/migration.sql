-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "stripeYearlyPriceId" TEXT,
ADD COLUMN     "yearlyPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "billingInterval" "BillingInterval" NOT NULL DEFAULT 'MONTH';
