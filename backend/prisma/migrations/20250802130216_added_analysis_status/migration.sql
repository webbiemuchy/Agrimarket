-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('pending', 'in_progress', 'completed', 'failed');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "analysis_status" "AnalysisStatus" NOT NULL DEFAULT 'pending';
