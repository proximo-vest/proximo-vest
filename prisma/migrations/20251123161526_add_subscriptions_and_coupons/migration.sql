-- CreateEnum
CREATE TYPE "OptionKey" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('VERY_EASY', 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('STUDENT', 'TEACHER', 'SCHOOL');

-- CreateEnum
CREATE TYPE "SubscriptionName" AS ENUM ('STUDENT_FREE', 'STUDENT_PREMIUM', 'STUDENT_ELITE', 'TEACHER_FREE', 'TEACHER_PREMIUM', 'SCHOOL_BASIC', 'SCHOOL_ADVANCED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE', 'FIXED', 'FREE_MONTH');

-- CreateEnum
CREATE TYPE "CouponTarget" AS ENUM ('STUDENT', 'TEACHER', 'SCHOOL', 'ALL');

-- CreateTable
CREATE TABLE "ExamBoard" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExamBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamEdition" (
    "id" SERIAL NOT NULL,
    "examBoardId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "editionLabel" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ExamEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPhase" (
    "id" SERIAL NOT NULL,
    "examEditionId" INTEGER NOT NULL,
    "phaseNumber" INTEGER NOT NULL,
    "dayNumber" INTEGER,
    "subjectBlock" TEXT,
    "questionCountExpected" INTEGER,
    "defaultOptionCount" INTEGER,
    "isDiscursive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExamPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "label" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stimulus" (
    "id" SERIAL NOT NULL,
    "contentHtml" TEXT,
    "contentText" TEXT,
    "sourceRef" TEXT,

    CONSTRAINT "Stimulus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StimulusAsset" (
    "id" SERIAL NOT NULL,
    "stimulusId" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "caption" TEXT,
    "pageHint" INTEGER,

    CONSTRAINT "StimulusAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "examPhaseId" INTEGER NOT NULL,
    "stimulusId" INTEGER,
    "numberLabel" TEXT NOT NULL,
    "isDiscursive" BOOLEAN NOT NULL DEFAULT false,
    "difficulty" "Difficulty",
    "status" "QuestionStatus" NOT NULL DEFAULT 'DRAFT',
    "sourcePageStart" INTEGER,
    "sourcePageEnd" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionSubject" (
    "questionId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "QuestionSubject_pkey" PRIMARY KEY ("questionId","subjectId")
);

-- CreateTable
CREATE TABLE "QuestionSkill" (
    "questionId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "QuestionSkill_pkey" PRIMARY KEY ("questionId","skillId")
);

-- CreateTable
CREATE TABLE "McqItem" (
    "questionId" INTEGER NOT NULL,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT true,
    "optionCount" INTEGER NOT NULL,
    "correctOptionKey" "OptionKey" NOT NULL,

    CONSTRAINT "McqItem_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "McqOption" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "label" "OptionKey" NOT NULL,
    "textHtml" TEXT,
    "textPlain" TEXT,

    CONSTRAINT "McqOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrItem" (
    "questionId" INTEGER NOT NULL,
    "answerGuidanceHtml" TEXT,
    "maxScore" DECIMAL(65,30),

    CONSTRAINT "FrItem_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "FrAnswerExpected" (
    "id" SERIAL NOT NULL,
    "frItemId" INTEGER NOT NULL,
    "label" TEXT,
    "answerHtml" TEXT,
    "maxScore" DECIMAL(65,30),

    CONSTRAINT "FrAnswerExpected_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrRubric" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "criterion" TEXT NOT NULL,
    "levelsJson" JSONB NOT NULL,

    CONSTRAINT "FrRubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("userId","permissionId")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "name" "SubscriptionName" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "CouponType" NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "validFor" "CouponTarget" NOT NULL,
    "redeemLimit" INTEGER,
    "used" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamBoard_slug_key" ON "ExamBoard"("slug");

-- CreateIndex
CREATE INDEX "ExamBoard_slug_idx" ON "ExamBoard"("slug");

-- CreateIndex
CREATE INDEX "ExamEdition_examBoardId_year_idx" ON "ExamEdition"("examBoardId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "ExamEdition_examBoardId_year_editionLabel_key" ON "ExamEdition"("examBoardId", "year", "editionLabel");

-- CreateIndex
CREATE INDEX "ExamPhase_examEditionId_idx" ON "ExamPhase"("examEditionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamPhase_examEditionId_phaseNumber_dayNumber_key" ON "ExamPhase"("examEditionId", "phaseNumber", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_slug_key" ON "Subject"("slug");

-- CreateIndex
CREATE INDEX "Subject_slug_idx" ON "Subject"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_code_key" ON "Skill"("code");

-- CreateIndex
CREATE INDEX "StimulusAsset_stimulusId_idx" ON "StimulusAsset"("stimulusId");

-- CreateIndex
CREATE INDEX "Question_examPhaseId_idx" ON "Question"("examPhaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_examPhaseId_numberLabel_key" ON "Question"("examPhaseId", "numberLabel");

-- CreateIndex
CREATE INDEX "QuestionSubject_subjectId_idx" ON "QuestionSubject"("subjectId");

-- CreateIndex
CREATE INDEX "QuestionSkill_skillId_idx" ON "QuestionSkill"("skillId");

-- CreateIndex
CREATE INDEX "McqOption_questionId_idx" ON "McqOption"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "McqOption_questionId_label_key" ON "McqOption"("questionId", "label");

-- CreateIndex
CREATE INDEX "FrAnswerExpected_frItemId_idx" ON "FrAnswerExpected"("frItemId");

-- CreateIndex
CREATE INDEX "FrRubric_questionId_idx" ON "FrRubric"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE INDEX "Permission_resource_action_idx" ON "Permission"("resource", "action");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- AddForeignKey
ALTER TABLE "ExamEdition" ADD CONSTRAINT "ExamEdition_examBoardId_fkey" FOREIGN KEY ("examBoardId") REFERENCES "ExamBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPhase" ADD CONSTRAINT "ExamPhase_examEditionId_fkey" FOREIGN KEY ("examEditionId") REFERENCES "ExamEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StimulusAsset" ADD CONSTRAINT "StimulusAsset_stimulusId_fkey" FOREIGN KEY ("stimulusId") REFERENCES "Stimulus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_examPhaseId_fkey" FOREIGN KEY ("examPhaseId") REFERENCES "ExamPhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_stimulusId_fkey" FOREIGN KEY ("stimulusId") REFERENCES "Stimulus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSubject" ADD CONSTRAINT "QuestionSubject_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSubject" ADD CONSTRAINT "QuestionSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSkill" ADD CONSTRAINT "QuestionSkill_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSkill" ADD CONSTRAINT "QuestionSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "McqItem" ADD CONSTRAINT "McqItem_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "McqOption" ADD CONSTRAINT "McqOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "McqItem"("questionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrItem" ADD CONSTRAINT "FrItem_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrAnswerExpected" ADD CONSTRAINT "FrAnswerExpected_frItemId_fkey" FOREIGN KEY ("frItemId") REFERENCES "FrItem"("questionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrRubric" ADD CONSTRAINT "FrRubric_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FrItem"("questionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
