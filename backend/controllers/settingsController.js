import { getSettings, updateSettings } from '../services/settingsService.js';
import { sendSuccess } from '../utils/responseHandler.js';

// 1. GET SYSTEM SETTINGS
export const getSystemSettings = async (req, res, next) => {
  try {
    const settings = await getSettings();
    return sendSuccess(res, 200, 'Settings retrieved successfully.', { settings });
  } catch (error) {
    next(error);
  }
};

// 2. UPDATE SYSTEM SETTINGS (Admin)
export const updateSystemSettings = async (req, res, next) => {
  try {
    const { previousState, newState } = await updateSettings(req.body, req.user._id, req);

    // Log admin action
    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'UPDATE_SETTINGS',
      entityType: 'Settings',
      entityId: newState._id,
      previousState,
      newState,
      req
    });

    return sendSuccess(res, 200, 'Settings updated successfully.', { settings: newState });
  } catch (error) {
    next(error);
  }
};
