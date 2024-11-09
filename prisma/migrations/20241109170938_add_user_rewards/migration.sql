-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "rewards" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
