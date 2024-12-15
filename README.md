# base64-media-helper 🚀

A powerful, lightweight TypeScript library for seamless media file conversions between Base64, Files, and URLs.

---

## 🌟 Features

-   📁 Convert files to Base64 effortlessly.
-   🔄 Convert Base64 strings back to files.
-   🌐 Download files from URLs.
-   🔗 Create object URLs from files.
-   💻 Full TypeScript support.
-   🌍 Works with both browsers and Node.js.

---

## 📦 Installation

#### Install the library via npm:

```bash
npm install base64-media-helper
```

## 🚀 Quick Start

#### Import the Library

```bash
import MediaConverter from 'base64-media-helper';
```

## 📘 Usage Examples

#### 1. File to Base64 Conversion

```bash
// Convert a file to a Base64 string
const fileInput = document.querySelector('input[type="file"]');
fileInput?.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      const base64String = await MediaConverter.fileToBase64(file);
      console.log(base64String);
    } catch (error) {
      console.error('Conversion failed', error);
    }
  }
});

```
#### 2. Base64 to File Conversion

```bash
// Convert Base64 string back to a file
const base64String = 'data:image/png;base64,...'; // Your Base64 string
const file = MediaConverter.base64ToFile(
  base64String,
  'converted-image.png',
  'image/png'
);
console.log(file);
```

#### 3. URL to File Conversion

```bash
// Download a file from a URL
const imageUrl = 'https://example.com/image.jpg';
try {
  const file = await MediaConverter.urlToFile(imageUrl, 'downloaded-image.jpg');
  console.log(file);

  // Optional: Create an object URL to display
  const objectUrl = MediaConverter.fileToUrl(file);
  document.getElementById('previewImage').src = objectUrl;
} catch (error) {
  console.error('URL conversion failed', error);
}
```

#### 4. File to Object URL

```bash
// Create a displayable URL from a file
const file = new File(['Hello, world!'], 'example.txt', { type: 'text/plain' });
const objectUrl = MediaConverter.fileToUrl(file);
console.log(objectUrl);

```

## API Methods

```fileToBase64(file: File): Promise<string>```
- Converts a File object to a Base64 string.
- Returns a Promise resolving to the Base64 representation.

```base64ToFile(base64: string, filename: string, mimeType: string): File```
- Converts a Base64 string back to a File object.
- Requires filename and MIME type.
- Returns a new File instance.

```urlToFile(url: string, filename?: string): Promise<File>```
- Downloads a file from a given URL.
- Optional filename (defaults to the URL's filename).
- Returns a Promise resolving to a File object.

```fileToUrl(file: File): string```
- Creates an object URL for a given file.
- Returns a string URL that can be used for displaying or downloading.

## 🛡️ Error Handling

Each method includes built-in error handling. Use try-catch blocks or .catch() with Promises to manage potential conversion errors.

```bash
try {
  const base64 = await MediaConverter.fileToBase64(file);
} catch (error) {
  // Handle conversion errors
  console.error('Conversion failed:', error);
}

```

## 🔍 Browser Compatibility

Supports modern browsers with:

- File
- FileReader
- Blob
- fetch

Compatible with ES6+ environments.

## 💡 Tips

- Check file sizes for large media conversions.
- Use MIME types accurately for proper file handling.
- Be mindful of memory usage when working with large files.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🌈 Author

Dinesh Basnet\
Happy coding! 🚀
