-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DONO_ACADEMIA', 'PROFESSOR', 'ALUNO');

-- CreateEnum
CREATE TYPE "PlanoAcademia" AS ENUM ('BASICO', 'PROFISSIONAL', 'PRO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ALUNO',
    "academiaId" TEXT NOT NULL,
    "professorId" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Academia" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "plano" "PlanoAcademia" NOT NULL DEFAULT 'PRO',
    "telefone" TEXT,
    "endereco" TEXT,
    "descricao" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Academia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoTreino" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "professorId" TEXT NOT NULL,
    "academiaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanoTreino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "musculosTrabalhados" TEXT,
    "academiaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExercicioEmPlano" (
    "id" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "exercicioId" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticoes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExercicioEmPlano_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_academiaId_idx" ON "User"("academiaId");

-- CreateIndex
CREATE INDEX "User_professorId_idx" ON "User"("professorId");

-- CreateIndex
CREATE INDEX "PlanoTreino_professorId_idx" ON "PlanoTreino"("professorId");

-- CreateIndex
CREATE INDEX "PlanoTreino_academiaId_idx" ON "PlanoTreino"("academiaId");

-- CreateIndex
CREATE INDEX "Exercicio_academiaId_idx" ON "Exercicio"("academiaId");

-- CreateIndex
CREATE INDEX "ExercicioEmPlano_planoId_idx" ON "ExercicioEmPlano"("planoId");

-- CreateIndex
CREATE INDEX "ExercicioEmPlano_exercicioId_idx" ON "ExercicioEmPlano"("exercicioId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_academiaId_fkey" FOREIGN KEY ("academiaId") REFERENCES "Academia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoTreino" ADD CONSTRAINT "PlanoTreino_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoTreino" ADD CONSTRAINT "PlanoTreino_academiaId_fkey" FOREIGN KEY ("academiaId") REFERENCES "Academia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercicio" ADD CONSTRAINT "Exercicio_academiaId_fkey" FOREIGN KEY ("academiaId") REFERENCES "Academia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercicioEmPlano" ADD CONSTRAINT "ExercicioEmPlano_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "PlanoTreino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercicioEmPlano" ADD CONSTRAINT "ExercicioEmPlano_exercicioId_fkey" FOREIGN KEY ("exercicioId") REFERENCES "Exercicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
