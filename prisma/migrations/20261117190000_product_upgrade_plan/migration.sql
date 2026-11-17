ALTER TABLE "Product"
  ADD COLUMN "upgradeName" TEXT,
  ADD COLUMN "upgradeDescription" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "upgradeIncluded" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "upgradePriceCents" INTEGER,
  ADD COLUMN "upgradeCheckoutUrl" TEXT;

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_upgradePriceCents_gt_priceCents"
  CHECK ("upgradePriceCents" IS NULL OR "upgradePriceCents" > "priceCents");

ALTER TABLE "Order" ALTER COLUMN "provider" SET DEFAULT 'cakto';
