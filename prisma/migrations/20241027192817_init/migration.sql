-- CreateTable
CREATE TABLE "User" (
    "twitch_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("twitch_id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_twitch_id_key" ON "User"("twitch_id");

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("twitch_id") ON DELETE RESTRICT ON UPDATE CASCADE;
