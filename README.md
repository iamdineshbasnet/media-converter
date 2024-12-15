# Media Converter TS

A TypeScript library for converting media files between different formats.

## Installation

```bash
npm install media-converter-ts
```

## Usage

### File to Base64

```typescript
const base64 = await MediaConverter.fileToBase64(file);
```

### Base64 to File

```typescript
const file = MediaConverter.base64ToFile(base64String, 'filename.png', 'image/png');
```

### URL to File

```typescript
const file = await MediaConverter.urlToFile(url);
```

### File to URL

```typescript
const objectUrl = MediaConverter.fileToUrl(file);
```

## Methods

-   `fileToBase64(file: File): Promise<string>`
-   `base64ToFile(base64: string, filename: string, mimeType: string): File`
-   `urlToFile(url: string, filename?: string): Promise<File>`
-   `fileToUrl(file: File): string`
    \*/
