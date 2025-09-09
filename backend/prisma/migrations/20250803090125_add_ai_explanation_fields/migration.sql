-- AlterTable
ALTER TABLE "AiAnalysis" ADD COLUMN     "conclusion" TEXT,
ADD COLUMN     "confidence_level_explanation" TEXT,
ADD COLUMN     "risk_score_explanation" TEXT,
ADD COLUMN     "roi_score_explanation" TEXT;
