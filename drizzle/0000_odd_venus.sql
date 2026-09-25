CREATE TABLE `admin_owner` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `home_state` (
	`id` text PRIMARY KEY NOT NULL,
	`config` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL
);
