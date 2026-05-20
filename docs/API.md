# API 文档

## 主类: ImageToText

### 构造函数

```javascript
const converter = new ImageToText(options);
```

**参数:**

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `options` | Object | 配置选项 | `{}` |
| `options.engine` | string | OCR 引擎 (`tesseract` \| `baidu` \| `tencent`) | `'tesseract'` |
| `options.languages` | Array | 支持的语言列表 | `['eng', 'chi_sim']` |
| `options.preprocessing` | Object | 预处理配置 | 见下表 |
| `options.debug` | boolean | 启用调试模式 | `false` |

**预处理配置 (preprocessing):**

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `resize` | boolean | 是否调整图片大小 | `true` |
| `contrast` | boolean | 是否增强对比度 | `true` |
| `denoise` | boolean | 是否去噪 | `true` |

### 方法

#### recognizeImage(imagePath, language)

识别单个图片中的文字。

**参数:**

- `imagePath` (string | Buffer): 图片路径或 Buffer
- `language` (string, 可选): 识别语言代码 (默认: 'eng')

**返回值:**

Promise<Object>:
```javascript
{
  text: string,              // 识别的文本
  confidence: number,        // 置信度 (0-1)
  blocks: Array,             // 文本块详情
  processingTime: number,    // 处理时间 (毫秒)
  language: string,          // 识别语言
  engine: string             // 使用的引擎
}
```

**示例:**

```javascript
const result = await converter.recognizeImage('./image.jpg', 'chi_sim');
console.log(result.text);
```

#### recognizeBatch(imagePaths, language)

批量识别多个图片。

**参数:**

- `imagePaths` (Array): 图片路径数组
- `language` (string, 可选): 识别语言代码

**返回值:**

Promise<Array>: 结果数组，每个元素同 `recognizeImage` 的返回值

**示例:**

```javascript
const results = await converter.recognizeBatch(
  ['./image1.jpg', './image2.jpg'],
  'chi_sim'
);
results.forEach(result => console.log(result.text));
```

#### recognizeFromUrl(imageUrl, language)

从 URL 识别图片。

**参数:**

- `imageUrl` (string): 图片 URL
- `language` (string, 可选): 识别语言代码

**返回值:**

Promise<Object>: 同 `recognizeImage`

**示例:**

```javascript
const result = await converter.recognizeFromUrl(
  'https://example.com/image.jpg',
  'eng'
);
console.log(result.text);
```

#### getSupportedLanguages()

获取支持的语言列表。

**返回值:**

Array<Object>:
```javascript
[
  { code: 'eng', name: 'English' },
  { code: 'chi_sim', name: '简体中文' },
  // ...
]
```

**示例:**

```javascript
const languages = converter.getSupportedLanguages();
languages.forEach(lang => {
  console.log(`${lang.code}: ${lang.name}`);
});
```

#### setEngineConfig(engine, config)

设置 OCR 引擎配置。

**参数:**

- `engine` (string): 引擎名称
- `config` (Object): 引擎配置

**示例:**

```javascript
converter.setEngineConfig('tesseract', {
  lang_list: 'eng+chi_sim+jpn'
});
```

## 支持的语言代码

| 代码 | 语言 |
|------|------|
| `eng` | English |
| `chi_sim` | 简体中文 |
| `chi_tra` | 繁体中文 |
| `jpn` | 日本語 |
| `kor` | 한국어 |
| `fra` | Français |
| `deu` | Deutsch |
| `spa` | Español |
| `rus` | Русский |

## 错误处理

```javascript
try {
  const result = await converter.recognizeImage('./image.jpg', 'chi_sim');
} catch (error) {
  console.error('识别失败:', error.message);
}
```

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `Image file not found` | 图片文件不存在 | 检查文件路径 |
| `Unsupported image format` | 不支持的图片格式 | 使用 JPG、PNG 等格式 |
| `Unsupported OCR engine` | 不支持的 OCR 引擎 | 使用 tesseract、baidu 或 tencent |
