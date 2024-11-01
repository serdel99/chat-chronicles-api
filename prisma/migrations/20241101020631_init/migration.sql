-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "enemy" TEXT NOT NULL,
    "hero" TEXT NOT NULL,
    "hero_name" TEXT NOT NULL,
    "enemy_name" TEXT NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryAct" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "story_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "StoryAct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StoryAct" ADD CONSTRAINT "StoryAct_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
