import { 
  users, categories, courses, batches, enrollments, lectures, resources, 
  assignmentSubmissions, orders, announcements,
  type User, type UpsertUser, type InsertCategory, type Category,
  type InsertCourse, type Course, type InsertBatch, type Batch,
  type InsertEnrollment, type Enrollment, type InsertLecture, type Lecture,
  type InsertResource, type Resource, type InsertOrder, type Order,
  type InsertAnnouncement, type Announcement
} from "@shared/schema";
import { db, hasDatabase } from "./db";
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

// In-memory storage implementation for development without database
export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private categories = new Map<number, Category>();
  private courses = new Map<number, Course>();
  private batches = new Map<number, Batch>();
  private enrollments: Enrollment[] = [];
  private lectures = new Map<number, Lecture>();
  private resources = new Map<number, Resource>();
  private orders = new Map<number, Order>();
  private announcements = new Map<number, Announcement>();
  private nextId = 1;

  constructor() {
    // Initialize with sample data for development
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample categories
    const categories = [
      { id: 1, name: 'Sanskrit', slug: 'sanskrit', description: 'Ancient Sanskrit language and literature', createdAt: new Date() },
      { id: 2, name: 'Philosophy', slug: 'philosophy', description: 'Ancient Indian philosophical traditions', createdAt: new Date() },
      { id: 3, name: 'Mathematics', slug: 'mathematics', description: 'Vedic mathematics and ancient computational methods', createdAt: new Date() },
      { id: 4, name: 'Wellness', slug: 'wellness', description: 'Yoga, meditation, and ancient wellness practices', createdAt: new Date() }
    ];

    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Sample courses
    const courses = [
      {
        id: 1, 
        title: 'Sanskrit for Beginners', 
        slug: 'sanskrit-for-beginners',
        description: 'Learn the fundamentals of Sanskrit language, script, and basic grammar.',
        price: '2499.00',
        thumbnail: '/images/sanskrit-basics.jpg',
        categoryId: 1,
        duration: '3 months',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'Vedic Philosophy Essentials',
        slug: 'vedic-philosophy-essentials',
        description: 'Introduction to the core principles of Vedic philosophy and ancient wisdom.',
        price: '3499.00',
        thumbnail: '/images/philosophy-basics.jpg',
        categoryId: 2,
        duration: '4 months',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    courses.forEach(course => this.courses.set(course.id, course));
    this.nextId = Math.max(...courses.map(c => c.id)) + 1;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      role: userData.role ?? null,
      createdAt: this.users.get(userData.id)?.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: this.nextId++,
      ...category,
      description: category.description ?? null,
      createdAt: new Date()
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  // Course operations
  async getCourses(): Promise<any[]> {
    const coursesArray = Array.from(this.courses.values())
      .filter(course => course.isActive)
      .map(course => {
        const category = this.categories.get(course.categoryId!);
        return {
          ...course,
          category: category ? {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description
          } : null
        };
      })
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    return coursesArray;
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(course => course.slug === slug && course.isActive);
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.categoryId === categoryId && course.isActive);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const newCourse: Course = {
      id: this.nextId++,
      ...course,
      description: course.description ?? null,
      thumbnail: course.thumbnail ?? null,
      categoryId: course.categoryId ?? null,
      duration: course.duration ?? null,
      isActive: course.isActive ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.courses.set(newCourse.id, newCourse);
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    const existing = this.courses.get(id);
    if (!existing) throw new Error('Course not found');
    
    const updatedCourse = { ...existing, ...course, updatedAt: new Date() };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    const existing = this.courses.get(id);
    if (existing) {
      this.courses.set(id, { ...existing, isActive: false });
    }
  }

  // Batch operations
  async getBatches(): Promise<Batch[]> {
    return Array.from(this.batches.values())
      .filter(batch => batch.isActive)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getBatchesByCourse(courseId: number): Promise<Batch[]> {
    return Array.from(this.batches.values()).filter(batch => batch.courseId === courseId && batch.isActive);
  }

  async getBatch(id: number): Promise<Batch | undefined> {
    const batch = this.batches.get(id);
    return batch?.isActive ? batch : undefined;
  }

  async createBatch(batch: InsertBatch): Promise<Batch> {
    const newBatch: Batch = {
      id: this.nextId++,
      ...batch,
      isActive: batch.isActive ?? null,
      schedule: batch.schedule ?? null,
      time: batch.time ?? null,
      startDate: batch.startDate ?? null,
      endDate: batch.endDate ?? null,
      mentorId: batch.mentorId ?? null,
      maxStudents: batch.maxStudents ?? null,
      createdAt: new Date()
    };
    this.batches.set(newBatch.id, newBatch);
    return newBatch;
  }

  async updateBatch(id: number, batch: Partial<InsertBatch>): Promise<Batch> {
    const existing = this.batches.get(id);
    if (!existing) throw new Error('Batch not found');
    
    const updatedBatch = { ...existing, ...batch };
    this.batches.set(id, updatedBatch);
    return updatedBatch;
  }

  // Enrollment operations
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollments.filter(enrollment => enrollment.userId === userId);
  }

  async getBatchEnrollments(batchId: number): Promise<Enrollment[]> {
    return this.enrollments.filter(enrollment => enrollment.batchId === batchId);
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const newEnrollment: Enrollment = {
      id: this.nextId++,
      ...enrollment,
      status: enrollment.status ?? null,
      progress: enrollment.progress ?? null,
      enrolledAt: new Date()
    };
    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  async isUserEnrolled(userId: string, batchId: number): Promise<boolean> {
    return this.enrollments.some(enrollment => enrollment.userId === userId && enrollment.batchId === batchId);
  }

  // Lecture operations
  async getBatchLectures(batchId: number): Promise<Lecture[]> {
    return Array.from(this.lectures.values())
      .filter(lecture => lecture.batchId === batchId)
      .sort((a, b) => (a.dateTime?.getTime() || 0) - (b.dateTime?.getTime() || 0));
  }

  async createLecture(lecture: InsertLecture): Promise<Lecture> {
    const newLecture: Lecture = {
      id: this.nextId++,
      ...lecture,
      description: lecture.description ?? null,
      dateTime: lecture.dateTime ?? null,
      liveLink: lecture.liveLink ?? null,
      recordingUrl: lecture.recordingUrl ?? null,
      isCompleted: lecture.isCompleted ?? null,
      createdAt: new Date()
    };
    this.lectures.set(newLecture.id, newLecture);
    return newLecture;
  }

  async updateLecture(id: number, lecture: Partial<InsertLecture>): Promise<Lecture> {
    const existing = this.lectures.get(id);
    if (!existing) throw new Error('Lecture not found');
    
    const updatedLecture = { ...existing, ...lecture };
    this.lectures.set(id, updatedLecture);
    return updatedLecture;
  }

  // Resource operations
  async getBatchResources(batchId: number, type?: string): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.batchId === batchId && (!type || resource.type === type))
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const newResource: Resource = {
      id: this.nextId++,
      ...resource,
      description: resource.description ?? null,
      fileUrl: resource.fileUrl ?? null,
      dueDate: resource.dueDate ?? null,
      createdAt: new Date()
    };
    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  // Order operations
  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      id: this.nextId++,
      ...order,
      status: order.status ?? null,
      razorpayOrderId: order.razorpayOrderId ?? null,
      razorpayPaymentId: order.razorpayPaymentId ?? null,
      createdAt: new Date()
    };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string, paymentId?: string): Promise<Order> {
    const existing = this.orders.get(id);
    if (!existing) throw new Error('Order not found');
    
    const updateData: any = { ...existing, status };
    if (paymentId) {
      updateData.razorpayPaymentId = paymentId;
    }
    
    this.orders.set(id, updateData);
    return updateData;
  }

  // Announcement operations
  async getBatchAnnouncements(batchId: number): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .filter(announcement => announcement.batchId === batchId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const newAnnouncement: Announcement = {
      id: this.nextId++,
      ...announcement,
      batchId: announcement.batchId ?? null,
      isPinned: announcement.isPinned ?? null,
      createdAt: new Date()
    };
    this.announcements.set(newAnnouncement.id, newAnnouncement);
    return newAnnouncement;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error('Database not available');
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!db) throw new Error('Database not available');
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
    if (!db) throw new Error('Database not available');
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    if (!db) throw new Error('Database not available');
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Course operations
  async getCourses(): Promise<any[]> {
    if (!db) throw new Error('Database not available');
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
    if (!db) throw new Error('Database not available');
    const [course] = await db.select().from(courses).where(and(eq(courses.slug, slug), eq(courses.isActive, true)));
    return course;
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(courses).where(and(eq(courses.categoryId, categoryId), eq(courses.isActive, true)));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    if (!db) throw new Error('Database not available');
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    if (!db) throw new Error('Database not available');
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db.update(courses).set({ isActive: false }).where(eq(courses.id, id));
  }

  // Batch operations
  async getBatches(): Promise<Batch[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(batches).where(eq(batches.isActive, true)).orderBy(desc(batches.createdAt));
  }

  async getBatchesByCourse(courseId: number): Promise<Batch[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(batches).where(and(eq(batches.courseId, courseId), eq(batches.isActive, true)));
  }

  async getBatch(id: number): Promise<Batch | undefined> {
    if (!db) throw new Error('Database not available');
    const [batch] = await db.select().from(batches).where(and(eq(batches.id, id), eq(batches.isActive, true)));
    return batch;
  }

  async createBatch(batch: InsertBatch): Promise<Batch> {
    if (!db) throw new Error('Database not available');
    const [newBatch] = await db.insert(batches).values(batch).returning();
    return newBatch;
  }

  async updateBatch(id: number, batch: Partial<InsertBatch>): Promise<Batch> {
    if (!db) throw new Error('Database not available');
    const [updatedBatch] = await db.update(batches).set(batch).where(eq(batches.id, id)).returning();
    return updatedBatch;
  }

  // Enrollment operations
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async getBatchEnrollments(batchId: number): Promise<Enrollment[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(enrollments).where(eq(enrollments.batchId, batchId));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    if (!db) throw new Error('Database not available');
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async isUserEnrolled(userId: string, batchId: number): Promise<boolean> {
    if (!db) throw new Error('Database not available');
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.batchId, batchId)));
    return !!enrollment;
  }

  // Lecture operations
  async getBatchLectures(batchId: number): Promise<Lecture[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(lectures).where(eq(lectures.batchId, batchId)).orderBy(asc(lectures.dateTime));
  }

  async createLecture(lecture: InsertLecture): Promise<Lecture> {
    if (!db) throw new Error('Database not available');
    const [newLecture] = await db.insert(lectures).values(lecture).returning();
    return newLecture;
  }

  async updateLecture(id: number, lecture: Partial<InsertLecture>): Promise<Lecture> {
    if (!db) throw new Error('Database not available');
    const [updatedLecture] = await db.update(lectures).set(lecture).where(eq(lectures.id, id)).returning();
    return updatedLecture;
  }

  // Resource operations
  async getBatchResources(batchId: number, type?: string): Promise<Resource[]> {
    if (!db) throw new Error('Database not available');
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
    if (!db) throw new Error('Database not available');
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  // Order operations
  async getUserOrders(userId: string): Promise<Order[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    if (!db) throw new Error('Database not available');
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string, paymentId?: string): Promise<Order> {
    if (!db) throw new Error('Database not available');
    const updateData: any = { status };
    if (paymentId) {
      updateData.razorpayPaymentId = paymentId;
    }
    
    const [updatedOrder] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return updatedOrder;
  }

  // Announcement operations
  async getBatchAnnouncements(batchId: number): Promise<Announcement[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(announcements).where(eq(announcements.batchId, batchId)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    if (!db) throw new Error('Database not available');
    const [newAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return newAnnouncement;
  }
}

// Choose storage implementation based on database availability
export const storage: IStorage = hasDatabase ? new DatabaseStorage() : new MemoryStorage();
