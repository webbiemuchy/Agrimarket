-- DropForeignKey
ALTER TABLE "AiAnalysis" DROP CONSTRAINT "AiAnalysis_project_id_fkey";

-- DropForeignKey
ALTER TABLE "ClimateData" DROP CONSTRAINT "ClimateData_project_id_fkey";

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClimateData" ADD CONSTRAINT "ClimateData_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
