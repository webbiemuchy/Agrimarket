/*
  Warnings:

  - You are about to drop the column `analysis_type` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `confidence_score` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `input_data` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `model_version` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `output_data` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `data_source` on the `ClimateData` table. All the data in the column will be lost.
  - You are about to drop the column `data_type` on the `ClimateData` table. All the data in the column will be lost.
  - You are about to drop the column `data_value` on the `ClimateData` table. All the data in the column will be lost.
  - You are about to drop the column `date_collected` on the `ClimateData` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ClimateData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id]` on the table `AiAnalysis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project_id]` on the table `ClimateData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `confidence_level` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expected_roi` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feasibility` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `market_analysis` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendations` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `risk_factors` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `risk_score` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roi_score` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strengths` to the `AiAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_weather` to the `ClimateData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendations` to the `ClimateData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `risk_factors` to the `ClimateData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `risk_level` to the `ClimateData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soil_data` to the `ClimateData` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "idx_ai_analysis_project";

-- DropIndex
DROP INDEX "idx_climate_data_project";

-- AlterTable
ALTER TABLE "AiAnalysis" DROP COLUMN "analysis_type",
DROP COLUMN "confidence_score",
DROP COLUMN "input_data",
DROP COLUMN "model_version",
DROP COLUMN "output_data",
ADD COLUMN     "confidence_level" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expected_roi" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "feasibility" TEXT NOT NULL,
ADD COLUMN     "market_analysis" TEXT NOT NULL,
ADD COLUMN     "recommendations" TEXT NOT NULL,
ADD COLUMN     "risk_factors" TEXT NOT NULL,
ADD COLUMN     "risk_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "roi_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "strengths" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClimateData" DROP COLUMN "data_source",
DROP COLUMN "data_type",
DROP COLUMN "data_value",
DROP COLUMN "date_collected",
DROP COLUMN "location",
ADD COLUMN     "current_weather" JSONB NOT NULL,
ADD COLUMN     "data_limitation" TEXT,
ADD COLUMN     "forecast" JSONB,
ADD COLUMN     "recommendations" TEXT NOT NULL,
ADD COLUMN     "risk_factors" TEXT NOT NULL,
ADD COLUMN     "risk_level" TEXT NOT NULL,
ADD COLUMN     "soil_data" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AiAnalysis_project_id_key" ON "AiAnalysis"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClimateData_project_id_key" ON "ClimateData"("project_id");
