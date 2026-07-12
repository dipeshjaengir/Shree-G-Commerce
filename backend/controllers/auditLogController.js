import AuditLog from '../models/AuditLog.js';
import { sendSuccess } from '../utils/responseHandler.js';

// GET AUDIT LOGS (Admin only)
export const getAuditLogs = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      action, 
      admin, 
      startDate, 
      endDate 
    } = req.query;

    const query = {};

    // Filter by action keyword
    if (action) {
      query.action = action;
    }

    // Filter by admin ID
    if (admin) {
      query.admin = admin;
    }

    // Filter by Date Range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the day
        const endOfDate = new Date(endDate);
        endOfDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endOfDate;
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Fetch and count in parallel
    const [logs, totalDocs] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skipNum)
        .limit(limitNum)
        .populate('admin', 'name email role'),
      AuditLog.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalDocs / limitNum);

    return sendSuccess(
      res, 
      200, 
      'Audit logs retrieved successfully.', 
      { logs }, 
      { page: pageNum, limit: limitNum, totalDocs, totalPages }
    );
  } catch (error) {
    next(error);
  }
};
