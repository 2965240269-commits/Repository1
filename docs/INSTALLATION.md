# 安装和配置指南

## 系统要求

- Node.js >= 14.0.0
- npm >= 6.0.0
- Python >= 3.6 (可选，用于 Python 版本)

## Node.js 安装

### 1. 安装依赖

```bash
npm install
```

### 2. 安装系统依赖 (如果需要)

#### macOS

```bash
brew install tesseract
```

#### Ubuntu/Debian

```bash
sudo apt-get install tesseract-ocr
```

#### Windows

从 [Tesseract 官方网站](https://github.com/UB-Mannheim/tesseract/wiki) 下载安装程序。

### 3. 配置环境变量 (可选)

创建 `.env` 文件:

```env
# Tesseract 配置 (仅在不使用 npm 包时需要)
TESSERACT_API_KEY=your_api_key

# 百度云配置
BAIDU_API_KEY=your_baidu_api_key
BAIDU_SECRET_KEY=your_baidu_secret_key

# 腾讯云配置
TENCENT_SECRET_ID=your_tencent_secret_id
TENCENT_SECRET_KEY=your_tencent_secret_key

# 调试模式
DEBUG=true
```

## 快速开始

### 基础使用

```javascript
const ImageToText = require('./src/index');

const converter = new ImageToText();

converter.recognizeImage('./image.jpg', 'chi_sim')
  .then(result => {
    console.log('识别结果:', result.text);
  })
  .catch(error => {
    console.error('错误:', error);
  });
```

### 使用示例脚本

```bash
# 基础示例
node examples/basic-example.js

# 高级示例
node examples/advanced-example.js

# 使用 npm 脚本
npm start
```

## OCR 引擎选择

### 1. Tesseract.js (推荐用于本地使用)

**优点:**
- 无需服务器
- 免费
- 支持离线
- 速度快

**配置:**

```javascript
const converter = new ImageToText({
  engine: 'tesseract',
  languages: ['eng', 'chi_sim']
});
```

### 2. 百度云 API

**优点:**
- 准确率高
- 支持多种格式
- 服务稳定

**配置:**

1. 获取 [百度云 API 密钥](https://cloud.baidu.com/)
2. 设置环境变量

```javascript
const converter = new ImageToText({
  engine: 'baidu'
});
```

### 3. 腾讯云 API

**优点:**
- 准确率高
- 支持多种格式
- 服务稳定

**配置:**

1. 获取 [腾讯云 API 密钥](https://cloud.tencent.com/)
2. 设置环境变量

```javascript
const converter = new ImageToText({
  engine: 'tencent'
});
```

## 预处理选项

```javascript
const converter = new ImageToText({
  preprocessing: {
    resize: true,        // 自动调整大图片尺寸
    contrast: true,      // 增强对比度
    denoise: true        // 去噪
  }
});
```

## 性能优化

### 调整图片大小

```javascript
const converter = new ImageToText({
  preprocessing: {
    resize: true
  }
});
```

### 批量处理

```javascript
const results = await converter.recognizeBatch(
  ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  'chi_sim'
);
```

## 故障排查

### 问题 1: 找不到 sharp

```bash
npm rebuild sharp
```

### 问题 2: Tesseract 初始化失败

```bash
# 清除缓存
rm -rf ~/.tesseract

# 重新安装
npm install tesseract.js --save
```

### 问题 3: 内存溢出

增加 Node.js 内存限制:

```bash
node --max-old-space-size=4096 examples/basic-example.js
```

## 测试

```bash
npm test
```

## 打包和部署

### 创建可执行文件

```bash
npm run build
```

### Docker 部署

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN apk add --no-cache tesseract-ocr

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

构建和运行:

```bash
docker build -t image-to-text .
docker run -p 3000:3000 image-to-text
```

## 许可证

MIT License
