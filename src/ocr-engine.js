/**
 * OCR 识别引擎
 * Supports Tesseract.js and Cloud APIs
 */

const { Logger } = require('./utils');

class OcrEngine {
  constructor(engine = 'tesseract') {
    this.engine = engine;
    this.logger = new Logger();
    this.config = this.initializeEngine(engine);
  }

  initializeEngine(engine) {
    const configs = {
      tesseract: {
        apiKey: process.env.TESSERACT_API_KEY || null,
        config: {
          lang_list: 'eng+chi_sim+jpn+kor+fra+deu+spa+rus'
        }
      },
      baidu: {
        apiKey: process.env.BAIDU_API_KEY || '',
        secretKey: process.env.BAIDU_SECRET_KEY || ''
      },
      tencent: {
        secretId: process.env.TENCENT_SECRET_ID || '',
        secretKey: process.env.TENCENT_SECRET_KEY || ''
      }
    };

    return configs[engine] || configs.tesseract;
  }

  /**
   * 使用 Tesseract.js 进行 OCR 识别
   */
  async recognizeWithTesseract(imageData, language) {
    try {
      const Tesseract = require('tesseract.js');

      this.logger.info(`Starting Tesseract.js OCR with language: ${language}`);

      const result = await Tesseract.recognize(imageData, language, {
        logger: m => this.logger.debug(`Tesseract progress: ${m.progress}`)
      });

      return {
        text: result.data.text,
        confidence: result.data.confidence / 100,
        blocks: this.parseBlocks(result.data),
        rawData: result.data
      };
    } catch (error) {
      this.logger.error('Tesseract.js error:', error);
      throw error;
    }
  }

  /**
   * 使用百度云 API 进行识别
   */
  async recognizeWithBaidu(imageData, language) {
    try {
      const axios = require('axios');
      const crypto = require('crypto');

      // 生成签名
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = this.generateBaiduSignature(timestamp);

      const response = await axios.post(
        'https://aip.baidubce.com/rest/2.0/ocr/v1/general',
        { image: imageData },
        {
          params: {
            access_token: this.config.apiKey
          }
        }
      );

      return {
        text: this.extractBaiduText(response.data),
        confidence: response.data.words_result_num > 0 ? 0.95 : 0,
        blocks: response.data.words_result || [],
        rawData: response.data
      };
    } catch (error) {
      this.logger.error('Baidu API error:', error);
      throw error;
    }
  }

  /**
   * 使用腾讯云 API 进行识别
   */
  async recognizeWithTencent(imageData, language) {
    try {
      this.logger.info('Tencent Cloud OCR is not yet implemented');
      throw new Error('Tencent Cloud OCR implementation coming soon');
    } catch (error) {
      this.logger.error('Tencent API error:', error);
      throw error;
    }
  }

  /**
   * 主识别方法
   */
  async recognize(imageData, language = 'eng') {
    switch (this.engine) {
      case 'tesseract':
        return await this.recognizeWithTesseract(imageData, language);
      case 'baidu':
        return await this.recognizeWithBaidu(imageData, language);
      case 'tencent':
        return await this.recognizeWithTencent(imageData, language);
      default:
        throw new Error(`Unsupported OCR engine: ${this.engine}`);
    }
  }

  /**
   * 解析识别结果中的文本块
   */
  parseBlocks(data) {
    if (data.paragraphs) {
      return data.paragraphs.map(para => ({
        text: para.text,
        confidence: para.confidence,
        bbox: para.bbox
      }));
    }
    return [];
  }

  /**
   * 提取百度 API 返回的文本
   */
  extractBaiduText(data) {
    return data.words_result
      .map(item => item.words)
      .join('\n');
  }

  /**
   * 生成百度签名
   */
  generateBaiduSignature(timestamp) {
    const crypto = require('crypto');
    const string = `${this.config.secretKey}${timestamp}${this.config.apiKey}`;
    return crypto.createHash('sha256').update(string).digest('hex');
  }

  /**
   * 获取支持的语言列表
   */
  getSupportedLanguages() {
    return [
      { code: 'eng', name: 'English' },
      { code: 'chi_sim', name: '简体中文' },
      { code: 'chi_tra', name: '繁体中文' },
      { code: 'jpn', name: '日本語' },
      { code: 'kor', name: '한국어' },
      { code: 'fra', name: 'Français' },
      { code: 'deu', name: 'Deutsch' },
      { code: 'spa', name: 'Español' },
      { code: 'rus', name: 'Русский' }
    ];
  }

  /**
   * 设置引擎配置
   */
  setConfig(engine, config) {
    if (this.engine === engine) {
      this.config = { ...this.config, ...config };
    }
  }
}

module.exports = OcrEngine;
