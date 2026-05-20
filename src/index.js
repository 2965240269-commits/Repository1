/**
 * 图片转文字插件主类
 * Image to Text Plugin Main Class
 */

const OcrEngine = require('./ocr-engine');
const ImageProcessor = require('./image-processor');
const { Logger, validateImagePath } = require('./utils');

class ImageToText {
  /**
   * 初始化插件
   * @param {Object} options - 配置选项
   * @param {string} options.engine - OCR 引擎 ('tesseract' | 'baidu' | 'tencent')
   * @param {Array} options.languages - 支持的语言列表
   * @param {Object} options.preprocessing - 图片预处理配置
   * @param {boolean} options.debug - 是否启用调试模式
   */
  constructor(options = {}) {
    this.options = {
      engine: options.engine || 'tesseract',
      languages: options.languages || ['eng', 'chi_sim'],
      preprocessing: {
        resize: true,
        contrast: true,
        denoise: true,
        ...options.preprocessing
      },
      debug: options.debug || false
    };

    this.logger = new Logger(this.options.debug);
    this.ocrEngine = new OcrEngine(options.engine);
    this.imageProcessor = new ImageProcessor();

    this.logger.info('ImageToText Plugin initialized', this.options);
  }

  /**
   * 识别单个图片中的文字
   * @param {string|Buffer} imagePath - 图片路径或 Buffer
   * @param {string} language - 识别语言
   * @returns {Promise<Object>} 识别结果
   */
  async recognizeImage(imagePath, language = 'eng') {
    try {
      const startTime = Date.now();
      this.logger.info(`Processing image: ${imagePath}`);

      // 验证输入
      validateImagePath(imagePath);

      // 预处理图片
      const processedImage = await this.imageProcessor.process(imagePath, {
        resize: this.options.preprocessing.resize,
        contrast: this.options.preprocessing.contrast,
        denoise: this.options.preprocessing.denoise
      });

      // 进行 OCR 识别
      const result = await this.ocrEngine.recognize(processedImage, language);

      const processingTime = Date.now() - startTime;

      return {
        text: result.text,
        confidence: result.confidence,
        blocks: result.blocks || [],
        processingTime,
        language,
        engine: this.options.engine
      };
    } catch (error) {
      this.logger.error('Error recognizing image:', error);
      throw error;
    }
  }

  /**
   * 批量识别多个图片
   * @param {Array<string>} imagePaths - 图片路径数组
   * @param {string} language - 识别语言
   * @returns {Promise<Array>} 识别结果数组
   */
  async recognizeBatch(imagePaths, language = 'eng') {
    try {
      this.logger.info(`Processing batch of ${imagePaths.length} images`);

      const results = await Promise.all(
        imagePaths.map(path => this.recognizeImage(path, language))
      );

      return results;
    } catch (error) {
      this.logger.error('Error in batch processing:', error);
      throw error;
    }
  }

  /**
   * 从 URL 识别图片
   * @param {string} imageUrl - 图片 URL
   * @param {string} language - 识别语言
   * @returns {Promise<Object>} 识别结果
   */
  async recognizeFromUrl(imageUrl, language = 'eng') {
    try {
      this.logger.info(`Processing image from URL: ${imageUrl}`);

      const axios = require('axios');
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      const buffer = Buffer.from(response.data, 'binary');
      return await this.recognizeImage(buffer, language);
    } catch (error) {
      this.logger.error('Error downloading or processing image from URL:', error);
      throw error;
    }
  }

  /**
   * 获取支持的语言列表
   * @returns {Array<string>} 语言代码列表
   */
  getSupportedLanguages() {
    return this.ocrEngine.getSupportedLanguages();
  }

  /**
   * 设置 OCR 引擎配置
   * @param {string} engine - 引擎名称
   * @param {Object} config - 引擎配置
   */
  setEngineConfig(engine, config) {
    this.ocrEngine.setConfig(engine, config);
    this.logger.info(`Engine config updated for ${engine}`);
  }
}

module.exports = ImageToText;
