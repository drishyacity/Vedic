import { 
  users, categories, courses, batches, enrollments, lectures, resources, 
  assignmentSubmissions, orders, announcements,
  type User, type UpsertUser, type InsertCategory, type Category,
  type InsertCourse, type Course, type InsertBatch, type Batch,
  type InsertEnrollment, type Enrollment, type InsertLecture, type Lecture,
  type InsertResource, type Resource, type InsertOrder, type Order,
  type InsertAnnouncement, type Announcement
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  getCoursesByCategory(categoryId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  
  // Batch operations
  getBatches(): Promise<Batch[]>;
  getBatchesByCourse(courseId: number): Promise<Batch[]>;
  getBatch(id: number): Promise<Batch | undefined>;
  createBatch(batch: InsertBatch): Promise<Batch>;
  updateBatch(id: number, batch: Partial<InsertBatch>): Promise<Batch>;
  
  // Enrollment operations
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  getBatchEnrollments(batchId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  isUserEnrolled(userId: string, batchId: number): Promise<boolean>;
  
  // Lecture operations
  getBatchLectures(batchId: number): Promise<Lecture[]>;
  createLecture(lecture: InsertLecture): Promise<Lecture>;
  updateLecture(id: number, lecture: Partial<InsertLecture>): Promise<Lecture>;
  
  // Resource operations
  getBatchResources(batchId: number, type?: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Order operations
  getUserOrders(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, paymentId?: string): Promise<Order>;
  
  // Announcement operations
  getBatchAnnouncements(batchId: number): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Course operations
  async getCourses(): Promise<any[]> {
    return await db
      .select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        description: courses.description,
        price: courses.price,
        thumbnail: courses.thumbnail,
        categoryId: courses.categoryId,
        duration: courses.duration,
        isActive: courses.isActive,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        }
      })
      .from(courses)
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .where(eq(courses.isActive, true))
      .orderBy(desc(courses.createdAt));
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(and(eq(courses.slug, slug), eq(courses.isActive, true)));
    return course;
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    return await db.select().from(courses).where(and(eq(courses.categoryId, categoryId), eq(courses.isActive, true)));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.update(courses).set({ isActive: false }).where(eq(courses.id, id));
  }

  // Batch operations
  async getBatches(): Promise<Batch[]> {
    return await db.select().from(batches).where(eq(batches.isActive, true)).orderBy(desc(batches.createdAt));
  }

  async getBatchesByCourse(courseId: number): Promise<Batch[]> {
    return await db.select().from(batches).where(and(eq(batches.courseId, courseId), eq(batches.isActive, true)));
  }

  async getBatch(id: number): Promise<Batch | undefined> {
    const [batch] = await db.select().from(batches).where(and(eq(batches.id, id), eq(batches.isActive, true)));
    return batch;
  }

  async createBatch(batch: InsertBatch): Promise<Batch> {
    const [newBatch] = await db.insert(batches).values(batch).returning();
    return newBatch;
  }

  async updateBatch(id: number, batch: Partial<InsertBatch>): Promise<Batch> {
    const [updatedBatch] = await db.update(batches).set(batch).where(eq(batches.id, id)).returning();
    return updatedBatch;
  }

  // Enrollment operations
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async getBatchEnrollments(batchId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.batchId, batchId));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async isUserEnrolled(userId: string, batchId: number): Promise<boolean> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.batchId, batchId)));
    return !!enrollment;
  }

  // Lecture operations
  async getBatchLectures(batchId: number): Promise<Lecture[]> {
    return await db.select().from(lectures).where(eq(lectures.batchId, batchId)).orderBy(asc(lectures.dateTime));
  }

  async createLecture(lecture: InsertLecture): Promise<Lecture> {
    const [newLecture] = await db.insert(lectures).values(lecture).returning();
    return newLecture;
  }

  async updateLecture(id: number, lecture: Partial<InsertLecture>): Promise<Lecture> {
    const [updatedLecture] = await db.update(lectures).set(lecture).where(eq(lectures.id, id)).returning();
    return updatedLecture;
  }

  // Resource operations
  async getBatchResources(batchId: number, type?: string): Promise<Resource[]> {
    if (type) {
      return await db.select().from(resources)
        .where(and(eq(resources.batchId, batchId), eq(resources.type, type)))
        .orderBy(desc(resources.createdAt));
    }
    
    return await db.select().from(resources)
      .where(eq(resources.batchId, batchId))
      .orderBy(desc(resources.createdAt));
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  // Order operations
  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string, paymentId?: string): Promise<Order> {
    const updateData: any = { status };
    if (paymentId) {
      updateData.razorpayPaymentId = paymentId;
    }
    
    const [updatedOrder] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return updatedOrder;
  }

  // Announcement operations
  async getBatchAnnouncements(batchId: number): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.batchId, batchId)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return newAnnouncement;
  }
}

export const storage = new DatabaseStorage();
