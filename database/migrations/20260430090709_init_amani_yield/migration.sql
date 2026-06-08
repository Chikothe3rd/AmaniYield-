-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FARMER', 'HERDER', 'YOUTH_OFFICER', 'GOV_ADMIN');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('WATER', 'GRAZING');

-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('DRY', 'VIABLE');

-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('AVAILABLE', 'SOLD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "region" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USSD_Report" (
    "id" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "status" "ResourceStatus" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "USSD_Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crop_Scan" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "detectedPest" TEXT,
    "healthPercentage" DOUBLE PRECISION NOT NULL,
    "recommendedAction" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Crop_Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Safe_Route" (
    "id" TEXT NOT NULL,
    "destination_lat" DOUBLE PRECISION NOT NULL,
    "destination_lng" DOUBLE PRECISION NOT NULL,
    "assignedHerderId" TEXT NOT NULL,
    "status" "RouteStatus" NOT NULL DEFAULT 'ACTIVE',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Safe_Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marketplace_Listing" (
    "id" TEXT NOT NULL,
    "seedlingType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceZMW" DOUBLE PRECISION NOT NULL,
    "sellerId" TEXT NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Marketplace_Listing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "USSD_Report" ADD CONSTRAINT "USSD_Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop_Scan" ADD CONSTRAINT "Crop_Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Safe_Route" ADD CONSTRAINT "Safe_Route_assignedHerderId_fkey" FOREIGN KEY ("assignedHerderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marketplace_Listing" ADD CONSTRAINT "Marketplace_Listing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
