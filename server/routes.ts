import type { Express } from "express";
import express, { type Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import bcrypt from "bcryptjs";
import { 
  insertCourseSchema, insertBatchSchema, insertEnrollmentSchema,
  insertLectureSchema, insertResourceSchema, insertOrderSchema,
  insertAnnouncementSchema, insertCategorySchema, insertChapterSchema,
  insertChapterItemSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      
      // Handle admin user separately since it's not in database
      if (userId === 'admin') {
        res.json({
          id: 'admin',
          email: 'admin@system.local',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'admin',
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return;
      }
      
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin login route
  app.post('/api/auth/admin-login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    // Validate admin credentials
    if (username === 'admin' && password === 'admin123') {
      try {
        // Create admin user object without database dependency for now
        const adminUser = {
          id: 'admin',
          email: 'admin@system.local',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'admin',
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Set up admin session manually
        (req as any).user = {
          id: 'admin',
          claims: { sub: 'admin' },
          expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
        };
        
        // Mark as authenticated in session
        req.login({
          id: 'admin',
          claims: { sub: 'admin' },
          expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
        }, (err) => {
          if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Session creation failed" });
          }
          // Send response only after successful login
          res.json({ success: true, user: adminUser });
        });
      } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Login failed" });
      }
    } else {
      res.status(401).json({ message: "Invalid admin credentials" });
    }
  });

  // Admin logout route
  app.post('/api/auth/admin-logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Chapter routes
  app.get('/api/courses/:courseId/chapters', isAuthenticated, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }
      
      const chapters = await storage.getChaptersByCourse(courseId);
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  app.get('/api/chapters/:chapterId/items', isAuthenticated, async (req: any, res) => {
    try {
      const chapterId = parseInt(req.params.chapterId);
      if (isNaN(chapterId)) {
        return res.status(400).json({ message: "Invalid chapter ID" });
      }
      
      const items = await storage.getChapterItems(chapterId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching chapter items:", error);
      res.status(500).json({ message: "Failed to fetch chapter items" });
    }
  });

  app.post('/api/chapters', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      
      // Check admin authorization
      if (userId !== 'admin') {
        const user = await storage.getUser(userId);
        if (user?.role !== 'admin') {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const chapterData = insertChapterSchema.parse(req.body);
      const chapter = await storage.createChapter(chapterData);
      res.json(chapter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating chapter:", error);
      res.status(500).json({ message: "Failed to create chapter" });
    }
  });

  app.patch('/api/chapters/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const chapterId = parseInt(req.params.id);
      
      if (isNaN(chapterId)) {
        return res.status(400).json({ message: "Invalid chapter ID" });
      }
      
      // Check admin authorization
      if (userId !== 'admin') {
        const user = await storage.getUser(userId);
        if (user?.role !== 'admin') {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const chapterData = insertChapterSchema.partial().parse(req.body);
      const chapter = await storage.updateChapter(chapterId, chapterData);
      res.json(chapter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating chapter:", error);
      res.status(500).json({ message: "Failed to update chapter" });
    }
  });

  app.post('/api/chapter-items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      
      // Check admin authorization
      if (userId !== 'admin') {
        const user = await storage.getUser(userId);
        if (user?.role !== 'admin') {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const itemData = insertChapterItemSchema.parse(req.body);
      const item = await storage.createChapterItem(itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating chapter item:", error);
      res.status(500).json({ message: "Failed to create chapter item" });
    }
  });

  app.patch('/api/chapter-items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const itemId = parseInt(req.params.id);
      
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      // Check admin authorization
      if (userId !== 'admin') {
        const user = await storage.getUser(userId);
        if (user?.role !== 'admin') {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const itemData = insertChapterItemSchema.partial().parse(req.body);
      const item = await storage.updateChapterItem(itemId, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating chapter item:", error);
      res.status(500).json({ message: "Failed to update chapter item" });
    }
  });

  // Enhanced lecture routes
  app.get('/api/lectures/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const lectures = await storage.getTodaysLectures(userId);
      res.json(lectures);
    } catch (error) {
      console.error("Error fetching today's lectures:", error);
      res.status(500).json({ message: "Failed to fetch today's lectures" });
    }
  });

  app.get('/api/lectures/live', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const lectures = await storage.getLiveLectures(userId);
      res.json(lectures);
    } catch (error) {
      console.error("Error fetching live lectures:", error);
      res.status(500).json({ message: "Failed to fetch live lectures" });
    }
  });

  app.get('/api/lectures/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const lectureId = parseInt(req.params.id);
      
      if (isNaN(lectureId)) {
        return res.status(400).json({ message: "Invalid lecture ID" });
      }
      
      const joinInfo = await storage.getLectureJoinInfo(lectureId, userId);
      
      if (!joinInfo) {
        return res.status(404).json({ message: "Lecture not found or not accessible" });
      }
      
      res.json(joinInfo);
    } catch (error) {
      console.error("Error fetching lecture join info:", error);
      res.status(500).json({ message: "Failed to fetch lecture join info" });
    }
  });

  // Library route
  app.get('/api/library/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims ? req.user.claims.sub : req.user.id;
      const libraryContent = await storage.getUserLibraryContent(userId);
      res.json(libraryContent);
    } catch (error) {
      console.error("Error fetching user library:", error);
      res.status(500).json({ message: "Failed to fetch user library" });
    }
  });

  // Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback data when database is unavailable
      const fallbackCategories = [
        { id: 1, name: "Sanskrit", slug: "sanskrit", description: "Learn the sacred language of ancient texts and mantras", createdAt: new Date() },
        { id: 2, name: "Philosophy", slug: "philosophy", description: "Explore the profound philosophical traditions of ancient India", createdAt: new Date() },
        { id: 3, name: "Mathematics", slug: "mathematics", description: "Discover ancient Indian mathematical concepts and their modern relevance", createdAt: new Date() },
        { id: 4, name: "Vedas", slug: "vedas", description: "Study the four Vedas and their spiritual significance", createdAt: new Date() },
        { id: 5, name: "Wellness", slug: "wellness", description: "Ancient practices for physical, mental and spiritual well-being", createdAt: new Date() },
        { id: 6, name: "Astrology", slug: "astrology", description: "Understanding Jyotish - the science of light and consciousness", createdAt: new Date() }
      ];
      res.json(fallbackCategories);
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Handle admin user specially - don't query database
      if (userId === 'admin') {
        // Admin user is authorized
      } else {
        const user = await storage.getUser(userId);
        if (user?.role !== 'admin') {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Courses routes
  app.get('/api/courses', async (req, res) => {
    try {
      const startTime = Date.now();
      const categoryId = req.query.categoryId as string;
      let courses;
      
      if (categoryId) {
        courses = await storage.getCoursesByCategory(parseInt(categoryId));
      } else {
        courses = await storage.getCourses();
      }
      
      const duration = Date.now() - startTime;
      console.log(`[PERF] Courses loaded in ${duration}ms`);
      
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Fallback data when database is unavailable
      const fallbackCourses = [
        {
          id: 1,
          title: "Sanskrit for Beginners",
          slug: "sanskrit-for-beginners",
          description: "Master the fundamentals of Sanskrit language including Devanagari script, basic grammar, and pronunciation. Learn to read simple texts and understand the meaning of common mantras and prayers.",
          price: "4500.00",
          thumbnail: null,
          categoryId: 1,
          duration: "3 months",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 1, name: "Sanskrit", slug: "sanskrit", description: "Learn the sacred language of ancient texts and mantras" }
        },
        {
          id: 2,
          title: "Introduction to Vedanta Philosophy",
          slug: "introduction-to-vedanta-philosophy",
          description: "Explore the profound wisdom of Vedanta philosophy through the study of Upanishads, Bhagavad Gita, and works of great acharyas like Adi Shankara. Understand the nature of consciousness and reality.",
          price: "5500.00",
          thumbnail: null,
          categoryId: 2,
          duration: "4 months",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 2, name: "Philosophy", slug: "philosophy", description: "Explore the profound philosophical traditions of ancient India" }
        },
        {
          id: 3,
          title: "Ancient Indian Mathematics",
          slug: "ancient-indian-mathematics",
          description: "Discover the mathematical genius of ancient India including the decimal system, zero, algebra, and trigonometry. Study works of Aryabhata, Brahmagupta, and other mathematicians.",
          price: "3800.00",
          thumbnail: null,
          categoryId: 3,
          duration: "2 months",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 3, name: "Mathematics", slug: "mathematics", description: "Discover ancient Indian mathematical concepts and their modern relevance" }
        },
        {
          id: 4,
          title: "Rigveda Samhita Study",
          slug: "rigveda-samhita-study",
          description: "Deep dive into the oldest Veda with proper pronunciation, meaning, and context. Learn the hymns dedicated to various deities and understand their spiritual significance.",
          price: "6500.00",
          thumbnail: null,
          categoryId: 4,
          duration: "6 months",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 4, name: "Vedas", slug: "vedas", description: "Study the four Vedas and their spiritual significance" }
        },
        {
          id: 5,
          title: "Ayurveda and Yoga Integration",
          slug: "ayurveda-yoga-integration",
          description: "Comprehensive course on Ayurvedic principles combined with yoga practices. Learn about doshas, pranayama, meditation, and lifestyle recommendations for optimal health.",
          price: "5200.00",
          thumbnail: null,
          categoryId: 5,
          duration: "4 months",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 5, name: "Wellness", slug: "wellness", description: "Ancient practices for physical, mental and spiritual well-being" }
        },
        {
          id: 6,
          title: "Jyotish: Vedic Astrology Foundations",
          slug: "jyotish-vedic-astrology-foundations",
          description: "Study the fundamental principles of Vedic astrology including planetary influences, houses, signs, and chart interpretation. Learn to understand karmic patterns and timing.",
          price: "7200.00",
          thumbnail: null,
          categoryId: 6,
          duration: "5 months",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 6, name: "Astrology", slug: "astrology", description: "Understanding Jyotish - the science of light and consciousness" }
        }
      ];
      res.json(fallbackCourses);
    }
  });

  app.get('/api/courses/:slug', async (req, res) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.put('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const courseData = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(parseInt(req.params.id), courseData);
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteCourse(parseInt(req.params.id));
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Batches routes
  app.get('/api/batches', async (req, res) => {
    try {
      const courseId = req.query.courseId as string;
      let batches;
      
      if (courseId) {
        batches = await storage.getBatchesByCourse(parseInt(courseId));
      } else {
        batches = await storage.getBatches();
      }
      
      res.json(batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      res.status(500).json({ message: "Failed to fetch batches" });
    }
  });

  app.get('/api/batches/:id', async (req, res) => {
    try {
      const batch = await storage.getBatch(parseInt(req.params.id));
      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }
      res.json(batch);
    } catch (error) {
      console.error("Error fetching batch:", error);
      res.status(500).json({ message: "Failed to fetch batch" });
    }
  });

  app.post('/api/batches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!['admin', 'manager'].includes(user?.role || '')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const batchData = insertBatchSchema.parse(req.body);
      const batch = await storage.createBatch(batchData);
      res.json(batch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating batch:", error);
      res.status(500).json({ message: "Failed to create batch" });
    }
  });

  // Enrollments routes
  app.get('/api/enrollments/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.get('/api/enrollments/batch/:batchId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!['admin', 'manager', 'mentor'].includes(user?.role || '')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const enrollments = await storage.getBatchEnrollments(parseInt(req.params.batchId));
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching batch enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.post('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollmentData = { ...req.body, userId };
      
      // Check if already enrolled
      const isEnrolled = await storage.isUserEnrolled(userId, enrollmentData.batchId);
      if (isEnrolled) {
        return res.status(400).json({ message: "Already enrolled in this batch" });
      }

      const enrollment = await storage.createEnrollment(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  // Lectures routes
  app.get('/api/batches/:batchId/lectures', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const batchId = parseInt(req.params.batchId);
      
      // Check if user is enrolled or has admin access
      const isEnrolled = await storage.isUserEnrolled(userId, batchId);
      const user = await storage.getUser(userId);
      const hasAccess = isEnrolled || ['admin', 'manager', 'mentor'].includes(user?.role || '');
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      const lectures = await storage.getBatchLectures(batchId);
      res.json(lectures);
    } catch (error) {
      console.error("Error fetching lectures:", error);
      res.status(500).json({ message: "Failed to fetch lectures" });
    }
  });

  app.post('/api/lectures', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!['admin', 'manager', 'mentor'].includes(user?.role || '')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const lectureData = insertLectureSchema.parse(req.body);
      const lecture = await storage.createLecture(lectureData);
      res.json(lecture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating lecture:", error);
      res.status(500).json({ message: "Failed to create lecture" });
    }
  });

  // Resources routes
  app.get('/api/batches/:batchId/resources', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const batchId = parseInt(req.params.batchId);
      const type = req.query.type as string;
      
      // Check if user is enrolled or has admin access
      const isEnrolled = await storage.isUserEnrolled(userId, batchId);
      const user = await storage.getUser(userId);
      const hasAccess = isEnrolled || ['admin', 'manager', 'mentor'].includes(user?.role || '');
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      const resources = await storage.getBatchResources(batchId, type);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.post('/api/resources', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!['admin', 'manager', 'mentor'].includes(user?.role || '')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating resource:", error);
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  // Orders routes
  app.get('/api/orders/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderData = { ...req.body, userId };
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put('/api/orders/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { status, paymentId } = req.body;
      const order = await storage.updateOrderStatus(parseInt(req.params.id), status, paymentId);
      
      // If payment successful, create enrollment
      if (status === 'completed') {
        await storage.createEnrollment({
          userId: order.userId,
          batchId: order.batchId,
          status: 'active'
        });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Announcements routes
  app.get('/api/batches/:batchId/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const batchId = parseInt(req.params.batchId);
      
      // Check if user is enrolled or has admin access
      const isEnrolled = await storage.isUserEnrolled(userId, batchId);
      const user = await storage.getUser(userId);
      const hasAccess = isEnrolled || ['admin', 'manager', 'mentor'].includes(user?.role || '');
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      const announcements = await storage.getBatchAnnouncements(batchId);
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post('/api/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!['admin', 'manager', 'mentor'].includes(user?.role || '')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const announcementData = { ...req.body, createdBy: userId };
      const announcement = await storage.createAnnouncement(announcementData);
      res.json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
