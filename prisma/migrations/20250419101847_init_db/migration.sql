-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_insights" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "igId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "followers" INTEGER NOT NULL,
    "follows" INTEGER NOT NULL,
    "reachTotal" INTEGER NOT NULL,
    "impressions" INTEGER NOT NULL,
    "profileVisits" INTEGER NOT NULL,
    "webTaps" INTEGER NOT NULL,
    "likesTotal" INTEGER NOT NULL,
    "commentsTotal" INTEGER NOT NULL,
    "savesTotal" INTEGER NOT NULL,
    "sharesTotal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_insights" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "igId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "mediaType" TEXT NOT NULL,
    "mediaProductType" TEXT NOT NULL,
    "caption" TEXT,
    "mediaUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "permalink" TEXT NOT NULL,
    "impressions" INTEGER NOT NULL,
    "reach" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "saved" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "plays" INTEGER,
    "replies" INTEGER,
    "engagement" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_insights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_insights_companyId_igId_date_key" ON "account_insights"("companyId", "igId", "date");

-- AddForeignKey
ALTER TABLE "account_insights" ADD CONSTRAINT "account_insights_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_insights" ADD CONSTRAINT "post_insights_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
