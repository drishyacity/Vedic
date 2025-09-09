import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCourseSchema, insertBatchSchema, insertEnrollmentSchema,
  insertLectureSchema, insertResourceSchema, insertOrderSchema,
  insertAnnouncementSchema, insertCategorySchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
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
      const categoryId = req.query.categoryId as string;
      let courses;
      
      if (categoryId) {
        courses = await storage.getCoursesByCategory(parseInt(categoryId));
      } else {
        courses = await storage.getCourses();
      }
      
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
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
