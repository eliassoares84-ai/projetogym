-- AlterTable
ALTER TABLE "PlanoTreino" ADD COLUMN "alunoId" TEXT;

-- AddForeignKey
ALTER TABLE "PlanoTreino" ADD CONSTRAINT "PlanoTreino_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "PlanoTreino_alunoId_idx" ON "PlanoTreino"("alunoId");
