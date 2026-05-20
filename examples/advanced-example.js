/**
 * 高级使用示例
 * Advanced Usage Examples
 */

const ImageToText = require('../src/index');
const path = require('path');
const fs = require('fs');

async function advancedExample() {
  try {
    const converter = new ImageToText({
      engine: 'tesseract',
      languages: ['eng', 'chi_sim', 'jpn'],
      preprocessing: {
        resize: true,
        contrast: true,
        denoise: true
      },
      debug: true
    });

    console.log('\n=== 高级示例 ===\n');

    // 示例 1: 批量处理
    console.log('示例 1: 批量处理多个图片');
    // const imagePaths = [
    //   path.join(__dirname, 'images/image1.jpg'),
    //   path.join(__dirname, 'images/image2.jpg'),
    //   path.join(__dirname, 'images/image3.jpg')
    // ];
    // const batchResults = await converter.recognizeBatch(imagePaths, 'chi_sim');
    // batchResults.forEach((result, index) => {
    //   console.log(`图片 ${index + 1}:`);
    //   console.log('  文本:', result.text);
    //   console.log('  置信度:', result.confidence);
    //   console.log('  处理时间:', result.processingTime, 'ms\n');
    // });

    // 示例 2: 多语言识别
    console.log('示例 2: 多语言识别');
    // const languages = ['eng', 'chi_sim', 'jpn'];
    // for (const lang of languages) {
    //   const result = await converter.recognizeImage(
    //     path.join(__dirname, 'images/multilang.jpg'),
    //     lang
    //   );
    //   console.log(`${lang}: ${result.text}\n`);
    // }

    // 示例 3: 保存识别结果
    console.log('示例 3: 保存识别结果到文件');
    // const result = await converter.recognizeImage(
    //   path.join(__dirname, 'images/test.jpg'),
    //   'chi_sim'
    // );
    // const outputDir = path.join(__dirname, 'results');
    // if (!fs.existsSync(outputDir)) {
    //   fs.mkdirSync(outputDir, { recursive: true });
    // }
    // const outputFile = path.join(outputDir, `result-${Date.now()}.txt`);
    // fs.writeFileSync(outputFile, result.text, 'utf8');
    // console.log('结果已保存到:', outputFile);

    // 示例 4: 错误处理
    console.log('示例 4: 错误处理演示');
    try {
      // 尝试识别不存在的文件
      // await converter.recognizeImage(
      //   '/path/to/nonexistent/image.jpg',
      //   'eng'
      // );
    } catch (error) {
      console.log('捕获错误:', error.message);
    }

    // 示例 5: 自定义配置
    console.log('\n示例 5: 自定义 OCR 引擎配置');
    // converter.setEngineConfig('tesseract', {
    //   lang_list: 'eng+chi_sim+jpn+kor'
    // });
    console.log('引擎配置已更新');

    // 示例 6: 处理性能测试
    console.log('\n示例 6: 性能测试');
    console.log('这个示例展示如何监测处理时间和性能');
    // const perfStart = Date.now();
    // const perfResult = await converter.recognizeImage(
    //   path.join(__dirname, 'images/test.jpg'),
    //   'chi_sim'
    // );
    // const perfTotal = Date.now() - perfStart;
    // console.log('总处理时间:', perfTotal, 'ms');
    // console.log('图片处理时间:', perfResult.processingTime, 'ms');

    console.log('\n✅ 高级示例完成！\n');
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

advancedExample();
