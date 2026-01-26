-- AlterTable
ALTER TABLE "Exercicio" ADD COLUMN "categoria" TEXT;

-- Atualiza exercícios existentes com categorias padrão baseado nos músculos trabalhados
UPDATE "Exercicio" SET "categoria" = 'Peito' WHERE "musculosTrabalhados" LIKE '%Peito%' OR "musculosTrabalhados" LIKE '%Triceps%';
UPDATE "Exercicio" SET "categoria" = 'Costas' WHERE "musculosTrabalhados" LIKE '%Costas%' OR "musculosTrabalhados" LIKE '%Larga%';
UPDATE "Exercicio" SET "categoria" = 'Pernas' WHERE "musculosTrabalhados" LIKE '%Pernas%' OR "musculosTrabalhados" LIKE '%Quadr%';
UPDATE "Exercicio" SET "categoria" = 'Ombros' WHERE "musculosTrabalhados" LIKE '%Ombro%' OR "musculosTrabalhados" LIKE '%Deltoid%';
UPDATE "Exercicio" SET "categoria" = 'Braços' WHERE "musculosTrabalhados" LIKE '%Bíceps%' OR "musculosTrabalhados" LIKE '%Tríceps%';
UPDATE "Exercicio" SET "categoria" = 'Core' WHERE "musculosTrabalhados" LIKE '%Core%' OR "musculosTrabalhados" LIKE '%Abdomen%';
UPDATE "Exercicio" SET "categoria" = 'Geral' WHERE "categoria" IS NULL;
