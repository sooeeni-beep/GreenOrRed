import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const homeState = sqliteTable("home_state", {
  id: text("id").primaryKey(),
  config: text("config").notNull(),
  revision: integer("revision").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const adminOwner = sqliteTable("admin_owner", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
});
