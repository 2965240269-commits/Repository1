/**
 * 图片预处理模块
 * Image preprocessing using Sharp
 */

const sharp = require('sharp');
const { Logger } = require('./utils');

class ImageProcessor {
  constructor() {
    this.logger = new Logger();
  }

  /**
   * 处理图片
   * @param {string|Buffer} input - 图片路径或 Buffer
   * @param {Object} options - 处理选项
   */
  async process(input, options = {}) {
    try {
      this.logger.info('Starting image processing');

      let image = sharp(input);
      const metadata = await image.metadata();

      this.logger.debug(`Original image size: ${metadata.width}x${metadata.height}`);

      // 调整图片大小（如果需要）
      if (options.resize && (metadata.width > 4000 || metadata.height > 4000)) {
        image = image.resize(4000, 4000, {
          fit: 'inside',
          withoutEnlargement: true
        });
        this.logger.info('Image resized');
      }

      // 增强对比度
      if (options.contrast) {
        image = await this.enhanceContrast(image);
        this.logger.info('Contrast enhanced');
      }

      // 去噪
      if (options.denoise) {
        image = await this.denoise(image);
        this.logger.info('Image denoised');
      }

      // 转换为灰度（提高识别准确性）
      image = image.grayscale();

      // 保存处理后的图片为 Buffer
      const processedBuffer = await image.png().toBuffer();

      return processedBuffer;
    } catch (error) {
      this.logger.error('Image processing error:', error);
      throw error;
    }
  }

  /**
   * 增强对比度
   */
  async enhanceContrast(image) {
    return image
      .normalize()
      .modulate({
        saturation: 1.2
      });
  }

  /**
   * 去噪
   */
  async denoise(image) {
    // 使用高斯模糊进行简单去噪
    return image.blur(0.5);
  }

  /**
   * 旋转图片（自动检测）
   */
  async autoRotate(input) {
    try {
      let image = sharp(input);
      const metadata = await image.metadata();

      if (metadata.orientation) {
        image = image.rotate();
        this.logger.info(`Image rotated to correct orientation`);
      }

      return await image.toBuffer();
    } catch (error) {
      this.logger.error('Auto-rotate error:', error);
      return input;
    }
  }

  /**
   * 裁剪图片
   */
  async crop(input, left, top, width, height) {
    try {
      const image = sharp(input);
      return await image
        .extract({ left, top, width, height })
        .toBuffer();
    } catch (error) {
      this.logger.error('Crop error:', error);
      throw error;
    }
  }

  /**
   * 获取图片信息
   */
  async getMetadata(input) {
    try {
      const image = sharp(input);
      const metadata = await image.metadata();

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        colorspace: metadata.space,
        hasAlpha: metadata.hasAlpha,
        orientation: metadata.orientation
      };
    } catch (error) {
      this.logger.error('Metadata error:', error);
      throw error;
    }
  }

  /**
   * 批量处理图片
   */
  async processBatch(inputs, options = {}) {
    try {
      this.logger.info(`Processing batch of ${inputs.length} images`);

      const results = await Promise.all(
        inputs.map(input => this.process(input, options))
      );

      return results;
    } catch (error) {
      this.logger.error('Batch processing error:', error);
      throw error;
    }
  }
}

module.exports = ImageProcessor;
