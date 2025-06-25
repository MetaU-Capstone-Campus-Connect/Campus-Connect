-- CreateTable
CREATE TABLE "Users" (
    "userId" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "userPwd" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_userPwd_key" ON "Users"("userPwd");
