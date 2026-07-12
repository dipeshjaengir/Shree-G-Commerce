import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

class StorageService {
  constructor() {
    this.provider = 'local';
    // Ensure local public uploads folders exist
    this.uploadDirs = {
      products: path.resolve('public/products'),
      categories: path.resolve('public/categories'),
      banners: path.resolve('public/banners'),
      logo: path.resolve('public/logo'),
      favicon: path.resolve('public/favicon')
    };

    Object.values(this.uploadDirs).forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    logger.info('StorageService initialized with Local disk provider.');
  }

  async uploadFile(fileBuffer, filename, folderType = 'products') {
    try {
      const targetDir = this.uploadDirs[folderType] || this.uploadDirs.products;
      const targetPath = path.join(targetDir, filename);
      
      fs.writeFileSync(targetPath, fileBuffer);
      
      // Return relative web URL
      const webUrl = `/public/${folderType}/${filename}`;
      logger.info(`File successfully written to: ${targetPath}`);
      return webUrl;
    } catch (err) {
      logger.error(`StorageService upload failure: ${err.message}`);
      throw err;
    }
  }

  async deleteFile(webUrl) {
    try {
      // Parse web URL back to local path
      const relativePath = webUrl.replace(/^\/public\//, '');
      const parts = relativePath.split('/');
      if (parts.length < 2) return;

      const folderType = parts[0];
      const filename = parts[1];

      const targetDir = this.uploadDirs[folderType];
      if (!targetDir) return;

      const targetPath = path.join(targetDir, filename);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
        logger.info(`File deleted from storage: ${targetPath}`);
      }
    } catch (err) {
      logger.warn(`StorageService delete warning: ${err.message}`);
    }
  }
}

const storageServiceInstance = new StorageService();
export default storageServiceInstance;
