import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("student"), // student, mentor, admin, manager
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories for courses
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  categoryId: integer("category_id").references(() => categories.id),
  duration: varchar("duration", { length: 50 }), // e.g., "6 months"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Batches (specific instances of courses with schedules)
export const batches = pgTable("batches", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  schedule: varchar("schedule", { length: 255 }), // e.g., "Mon, Wed, Fri"
  time: varchar("time", { length: 50 }), // e.g., "7:00 PM"
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  mentorId: varchar("mentor_id").references(() => users.id),
  maxStudents: integer("max_students").default(50),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  batchId: integer("batch_id").references(() => batches.id).notNull(),
  status: varchar("status").default("active"), // active, completed, cancelled
  progress: integer("progress").default(0), // percentage
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

// Chapters (course content organization)
export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  position: integer("position").default(0),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chapter Items (videos, notes, work within chapters)
export const chapterItems = pgTable("chapter_items", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").references(() => chapters.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // video, note, work
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  youtubeId: varchar("youtube_id", { length: 50 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  durationSeconds: integer("duration_seconds"),
  position: integer("position").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lectures
export const lectures = pgTable("lectures", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").references(() => batches.id).notNull(),
  chapterId: integer("chapter_id").references(() => chapters.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dateTime: timestamp("date_time"),
  liveLink: varchar("live_link", { length: 500 }),
  recordingUrl: varchar("recording_url", { length: 500 }),
  recordingThumbnail: varchar("recording_thumbnail", { length: 500 }),
  meetingProvider: varchar("meeting_provider", { length: 50 }), // zoom, google_meet, other
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resources (notes, assignments, etc.)
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").references(() => batches.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // pdf, notes, assignment
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 500 }),
  dueDate: timestamp("due_date"), // for assignments
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignment submissions
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  resourceId: integer("resource_id").references(() => resources.id).notNull(),
  fileUrl: varchar("file_url", { length: 500 }),
  submittedAt: timestamp("submitted_at").defaultNow(),
  grade: integer("grade"), // out of 100
  feedback: text("feedback"),
  status: varchar("status").default("submitted"), // submitted, graded, returned
});

// Orders/Payments
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  batchId: integer("batch_id").references(() => batches.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default("pending"), // pending, completed, failed, refunded
  razorpayOrderId: varchar("razorpay_order_id"),
  razorpayPaymentId: varchar("razorpay_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").references(() => batches.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isPinned: boolean("is_pinned").default(false),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  assignmentSubmissions: many(assignmentSubmissions),
  orders: many(orders),
  announcements: many(announcements),
  mentorBatches: many(batches, { relationName: "mentor" }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  category: one(categories, {
    fields: [courses.categoryId],
    references: [categories.id],
  }),
  batches: many(batches),
  chapters: many(chapters),
}));

export const batchesRelations = relations(batches, ({ one, many }) => ({
  course: one(courses, {
    fields: [batches.courseId],
    references: [courses.id],
  }),
  mentor: one(users, {
    fields: [batches.mentorId],
    references: [users.id],
    relationName: "mentor",
  }),
  enrollments: many(enrollments),
  lectures: many(lectures),
  resources: many(resources),
  announcements: many(announcements),
  orders: many(orders),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  batch: one(batches, {
    fields: [enrollments.batchId],
    references: [batches.id],
  }),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  items: many(chapterItems),
  lectures: many(lectures),
}));

export const chapterItemsRelations = relations(chapterItems, ({ one }) => ({
  chapter: one(chapters, {
    fields: [chapterItems.chapterId],
    references: [chapters.id],
  }),
}));

export const lecturesRelations = relations(lectures, ({ one }) => ({
  batch: one(batches, {
    fields: [lectures.batchId],
    references: [batches.id],
  }),
  chapter: one(chapters, {
    fields: [lectures.chapterId],
    references: [chapters.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  batch: one(batches, {
    fields: [resources.batchId],
    references: [batches.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [assignmentSubmissions.userId],
    references: [users.id],
  }),
  resource: one(resources, {
    fields: [assignmentSubmissions.resourceId],
    references: [resources.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  batch: one(batches, {
    fields: [orders.batchId],
    references: [batches.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  batch: one(batches, {
    fields: [announcements.batchId],
    references: [batches.id],
  }),
  createdByUser: one(users, {
    fields: [announcements.createdBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBatchSchema = createInsertSchema(batches).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
  createdAt: true,
});

export const insertChapterItemSchema = createInsertSchema(chapterItems).omit({
  id: true,
  createdAt: true,
});

export const insertLectureSchema = createInsertSchema(lectures).omit({
  id: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type Batch = typeof batches.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;

export type InsertChapterItem = z.infer<typeof insertChapterItemSchema>;
export type ChapterItem = typeof chapterItems.$inferSelect;

export type InsertLecture = z.infer<typeof insertLectureSchema>;
export type Lecture = typeof lectures.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
