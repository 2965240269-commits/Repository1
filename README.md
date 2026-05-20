# 图片转文字插件 (Image to Text Plugin)

一个功能强大的图片转文字插件，支持多种图片格式和多语言识别。

## 功能特性

- ✅ 支持多种图片格式 (JPG, PNG, GIF, BMP, WebP)
- ✅ 文本识别 (OCR) - 使用 Tesseract 或云 API
- ✅ 多语言支持
- ✅ 批量处理
- ✅ 文本编辑和导出
- ✅ 高精度识别

## 快速开始

### 安装依赖

```bash
npm install
# 或
pip install -r requirements.txt
```

### 使用示例

```javascript
// JavaScript/Node.js
const ImageToText = require('./src/index');

const converter = new ImageToText();
const result = await converter.recognizeImage('./image.jpg', 'chi_sim');
console.log(result.text);
```

```python
# Python
from image_to_text import ImageToText

converter = ImageToText()
result = converter.recognize_image('./image.jpg', language='chi_sim')
print(result['text'])
```

## 项目结构

```
Repository1/
├── src/                    # 源代码
│   ├── index.js           # 主入口
│   ├── ocr-engine.js      # OCR 引擎
│   ├── image-processor.js # 图片处理
│   └── utils.js           # 工具函数
├── examples/              # 使用示例
├── tests/                 # 测试文件
├── docs/                  # 文档
├── package.json           # 项目配置
└── README.md             # 说明文档
```

## API 文档

### recognizeImage(imagePath, language)

识别图片中的文字。

**参数：**
- `imagePath` (string): 图片路径
- `language` (string): 识别语言 (默认: 'eng')

**返回：**
```javascript
{
  text: string,           // 识别的文本
  confidence: number,     // 置信度 (0-1)
  blocks: Array,          // 文本块详情
  processingTime: number  // 处理时间 (ms)
}
```

## 配置选项

在 `config.json` 中配置：

```json
{
  "engine": "tesseract",
  "languages": ["eng", "chi_sim"],
  "preprocessing": {
    "resize": true,
    "contrast": true,
    "denoise": true
  }
}
```

## 贡献指南

欢迎提交 Issues 和 Pull Requests！

## 许可证

MIT License

## 联系方式

如有问题，请提交 Issue 或联系维护者。
