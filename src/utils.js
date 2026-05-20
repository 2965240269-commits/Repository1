/**
 * 工具函数
 */

const fs = require('fs');
const path = require('path');

/**
 * 日志记录工具
 */
class Logger {
  constructor(debug = false) {
    this.debug = debug;
    this.timestamp = () => new Date().toISOString();
  }

  info(message, data = null) {
    const log = `[${this.timestamp()}] [INFO] ${message}`;
    console.log(log, data || '');
  }

  error(message, error = null) {
    const log = `[${this.timestamp()}] [ERROR] ${message}`;
    console.error(log);
    if (error) {
      console.error(error);
    }
  }

  debug(message, data = null) {
    if (this.debug) {
      const log = `[${this.timestamp()}] [DEBUG] ${message}`;
      console.log(log, data || '');
    }
  }

  warn(message, data = null) {
    const log = `[${this.timestamp()}] [WARN] ${message}`;
    console.warn(log, data || '');
  }
}

/**
 * 验证图片路径
 */
function validateImagePath(imagePath) {
  if (typeof imagePath === 'string') {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const ext = path.extname(imagePath).toLowerCase();
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

    if (!supportedFormats.includes(ext)) {
      throw new Error(`Unsupported image format: ${ext}`);
    }
  } else if (!Buffer.isBuffer(imagePath)) {
    throw new Error('imagePath must be a string path or Buffer');
  }
}

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
async function retry(fn, maxRetries = 3, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(delayMs * Math.pow(2, i));
    }
  }
}

/**
 * 检查依赖
 */
function checkDependencies() {
  const deps = ['sharp', 'tesseract.js'];
  const missing = [];

  deps.forEach(dep => {
    try {
      require.resolve(dep);
    } catch (e) {
      missing.push(dep);
    }
  });

  if (missing.length > 0) {
    console.warn(`Warning: Missing dependencies: ${missing.join(', ')}`);
    console.warn(`Run: npm install ${missing.join(' ')}`);
  }
}

module.exports = {
  Logger,
  validateImagePath,
  delay,
  retry,
  checkDependencies
};
