import AuditLog from '../models/AuditLog.js';
import { adminLogger } from '../utils/logger.js';

export const logAdminAction = async ({
  adminId,
  action,
  entityType,
  entityId,
  previousState = null,
  newState = null,
  req = null
}) => {
  try {
    const ipAddress = req ? req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress : null;
    const userAgent = req ? req.headers['user-agent'] : null;

    const auditEntry = new AuditLog({
      admin: adminId,
      action,
      entityType,
      entityId,
      previousState,
      newState,
      ipAddress,
      userAgent
    });

    await auditEntry.save();
    
    adminLogger.info(`Audit Log Added: ${action} on ${entityType} ID: ${entityId} by Admin ID: ${adminId}`, {
      adminId,
      action,
      entityType,
      entityId,
      ipAddress
    });
  } catch (error) {
    // Fail-safe: we don't want audit logging to crash the main request transaction if it errors itself
    adminLogger.error(`Failed to write Audit Log entry: ${error.message}`);
  }
};
