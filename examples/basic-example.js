/**
 * 基础使用示例
 * Basic Usage Example
 */

const ImageToText = require('../src/index');
const path = require('path');

async function basicExample() {
  try {
    // 创建插件实例
    const converter = new ImageToText({
      engine: 'tesseract',
      languages: ['eng', 'chi_sim'],
      debug: true
    });

    console.log('\n=== 基础示例 ===\n');

    // 示例 1: 识别本地图片
    console.log('示例 1: 识别本地图片 (英文)');
    console.log('注: 请将测试图片放在 examples/images 目录中\n');

    // 如果你有测试图片，取消下面的注释
    // const result1 = await converter.recognizeImage(
    //   path.join(__dirname, 'images/test-english.jpg'),
    //   'eng'
    // );
    // console.log('识别结果:', result1.text);
    // console.log('置信度:', result1.confidence);
    // console.log('处理时间:', result1.processingTime, 'ms\n');

    // 示例 2: 识别中文
    console.log('示例 2: 识别中文');
    // const result2 = await converter.recognizeImage(
    //   path.join(__dirname, 'images/test-chinese.jpg'),
    //   'chi_sim'
    // );
    // console.log('识别结果:', result2.text);
    // console.log('置信度:', result2.confidence);
    // console.log('处理时间:', result2.processingTime, 'ms\n');

    // 示例 3: 从 URL 识别
    console.log('示例 3: 从 URL 识别图片');
    // const result3 = await converter.recognizeFromUrl(
    //   'https://example.com/image.jpg',
    //   'eng'
    // );
    // console.log('识别结果:', result3.text);

    // 获取支持的语言列表
    console.log('支持的语言列表:');
    const languages = converter.getSupportedLanguages();
    languages.forEach(lang => {
      console.log(`  - ${lang.code}: ${lang.name}`);
    });

    console.log('\n✅ 基础示例完成！\n');
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

basicExample();
