-- CreateEnum
CREATE TYPE "EStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "EStatusProcess" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EStatusReview" AS ENUM ('APPROVED', 'PENDING', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EMediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'FILE');

-- CreateEnum
CREATE TYPE "EMediaSource" AS ENUM ('LOCAL', 'REMOTE');

-- CreateEnum
CREATE TYPE "EUserStatus" AS ENUM ('PENDING', 'ACTIVE', 'HOLD', 'BAN', 'DELETE');

-- CreateEnum
CREATE TYPE "EUserLevel" AS ENUM ('BASIC', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "EPostStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'SCHEDULED', 'TRASH');

-- CreateEnum
CREATE TYPE "EActivityStatus" AS ENUM ('ONLINE', 'OFFLINE', 'ALWAY', 'BUSY');

-- CreateEnum
CREATE TYPE "ELanguage" AS ENUM ('en', 'vi');

-- CreateEnum
CREATE TYPE "EBalanceType" AS ENUM ('CREDIT', 'COMMISSION');

-- CreateEnum
CREATE TYPE "EUserGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "options" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "value" TEXT,
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "fullname" TEXT,
    "password" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "address" TEXT,
    "region" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "socials" JSONB,
    "about" TEXT,
    "content" TEXT,
    "isVerified" BOOLEAN DEFAULT false,
    "deleted" BOOLEAN DEFAULT false,
    "gender" "EUserGender" DEFAULT 'MALE',
    "status" "EUserStatus" NOT NULL,
    "level" "EUserLevel" NOT NULL DEFAULT 'BASIC',
    "referrerId" TEXT,
    "score" INTEGER DEFAULT 0,
    "credits" DOUBLE PRECISION DEFAULT 0,
    "commissions" DOUBLE PRECISION DEFAULT 0,
    "avatarId" TEXT,
    "coverId" TEXT,
    "roleId" TEXT,
    "lastActivity" TIMESTAMP(3),
    "activityStatus" "EActivityStatus" DEFAULT 'ONLINE',
    "language" "ELanguage" DEFAULT 'vi',
    "setting" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_metas" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "user_metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "alt" TEXT,
    "ext" TEXT,
    "hash" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "size" DOUBLE PRECISION,
    "url" TEXT,
    "urlRaw" TEXT,
    "urlLarge" TEXT,
    "urlMedium" TEXT,
    "urlSmall" TEXT,
    "urlTiny" TEXT,
    "createdById" TEXT,
    "type" "EMediaType" DEFAULT 'IMAGE',
    "source" "EMediaSource" DEFAULT 'LOCAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_temps" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "value" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "table_temps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "variables" TEXT,
    "name" TEXT,
    "title" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_template_lang" (
    "id" TEXT NOT NULL,
    "emailTemplateId" TEXT NOT NULL,
    "lang" "ELanguage" NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "email_template_lang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "views" INTEGER DEFAULT 0,
    "status" "EPostStatus" DEFAULT 'DRAFT',
    "source" TEXT,
    "hot" BOOLEAN DEFAULT false,
    "deleted" BOOLEAN DEFAULT false,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canComment" BOOLEAN DEFAULT true,
    "authorId" TEXT,
    "mediaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_meta" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "post_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_category" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "post_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_related" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "postId" TEXT NOT NULL,
    "postRelatedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "post_related_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "status" "EStatus" DEFAULT 'ACTIVE',
    "color" TEXT,
    "sort" INTEGER,
    "deleted" BOOLEAN DEFAULT false,
    "iconId" TEXT,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "title" TEXT,
    "content" TEXT,
    "extra" JSONB,
    "isGlobal" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_users" (
    "id" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "notification_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_meta" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "mediaId" TEXT,
    "postId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "seo_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "newBalance" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "status" "EStatusProcess" NOT NULL,
    "balanceType" "EBalanceType" NOT NULL DEFAULT 'CREDIT',
    "refId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "status" "EStatusProcess" NOT NULL,
    "bankCode" TEXT,
    "doneAt" TIMESTAMP(3),
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "options_key_key" ON "options"("key");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users.username_unique" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users.phone_unique" ON "users"("phone");

-- CreateIndex
CREATE INDEX "userId" ON "user_metas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roles.name_unique" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_key_key" ON "email_templates"("key");

-- CreateIndex
CREATE UNIQUE INDEX "post.slug_unique" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "post_author_fk" ON "posts"("authorId");

-- CreateIndex
CREATE INDEX "postId" ON "post_meta"("postId");

-- CreateIndex
CREATE INDEX "post_relation_category_post_id_fkey" ON "post_category"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "post_category_categoryId_postId_key" ON "post_category"("categoryId", "postId");

-- CreateIndex
CREATE INDEX "post_related_post_related_id_fkey" ON "post_related"("postRelatedId");

-- CreateIndex
CREATE UNIQUE INDEX "post_related_postId_postRelatedId_key" ON "post_related"("postId", "postRelatedId");

-- CreateIndex
CREATE UNIQUE INDEX "category.slug_unique" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "category_iconId_fkey" ON "categories"("iconId");

-- CreateIndex
CREATE INDEX "category_imageId_fkey" ON "categories"("imageId");

-- CreateIndex
CREATE INDEX "notification_users_user_id" ON "notification_users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_users_userId_notificationId_key" ON "notification_users"("userId", "notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_meta_postId_key" ON "seo_meta"("postId");

-- CreateIndex
CREATE INDEX "transaction_ref_id_idx" ON "transactions"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_uniqueId_key" ON "payments"("uniqueId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "user_ibfk_2" FOREIGN KEY ("avatarId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "user_ibfk_3" FOREIGN KEY ("coverId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_metas" ADD CONSTRAINT "user_metas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_template_lang" ADD CONSTRAINT "email_template_lang_emailTemplateId_fkey" FOREIGN KEY ("emailTemplateId") REFERENCES "email_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_meta" ADD CONSTRAINT "post_meta_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_related" ADD CONSTRAINT "post_related_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_related" ADD CONSTRAINT "post_related_postRelatedId_fkey" FOREIGN KEY ("postRelatedId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_meta" ADD CONSTRAINT "seo_meta_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_meta" ADD CONSTRAINT "seo_meta_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
