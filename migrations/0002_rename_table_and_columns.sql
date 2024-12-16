-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "retries" INTEGER NOT NULL DEFAULT 5,
    "protocol" TEXT NOT NULL DEFAULT 'http',
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 80,
    "path" TEXT NOT NULL DEFAULT '',
    "connect_timeout" INTEGER NOT NULL DEFAULT 6000,
    "read_timeout" INTEGER NOT NULL DEFAULT 6000,
    "write_timeout" INTEGER NOT NULL DEFAULT 6000,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_services" ("enabled", "host", "id", "name", "path", "port", "protocol", "retries", "tags") SELECT "enabled", "host", "id", "name", "path", "port", "protocol", "retries", "tags" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
