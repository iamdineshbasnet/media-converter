interface MediaConverterOptions {
	maxFileSizeMB?: number;
	validateContent?: boolean;
	allowedMimeTypes?: string[];
}

interface ConversionResult {
	data: string;
	mimeType: string;
	filename: string;
	sizeInMB: number;
}

export class MediaConverter {
	private static readonly DEFAULT_OPTIONS: MediaConverterOptions = {
		maxFileSizeMB: 50,
		validateContent: true,
		allowedMimeTypes: [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
			'video/mp4',
			'video/webm',
			'audio/mpeg',
			'audio/wav',
			'audio/ogg',
			'application/pdf',
		],
	};

	private static readonly CHUNK_SIZE = 512;

	/**
	 * Convert media file to Base64 with validation and metadata
	 * @param file File object to convert
	 * @param options Configuration options
	 * @returns Promise resolving to conversion result
	 */
	static async fileToBase64(
		file: File,
		options: MediaConverterOptions = {}
	): Promise<ConversionResult> {
		const settings = { ...this.DEFAULT_OPTIONS, ...options };

		// Validate file type
		if (
			settings.validateContent &&
			!this.isValidMimeType(file.type, settings.allowedMimeTypes!)
		) {
			throw new Error(
				`Unsupported file type: ${
					file.type
				}. Allowed types: ${settings.allowedMimeTypes!.join(', ')}`
			);
		}

		// Validate file size
		const fileSizeMB = file.size / (1024 * 1024);
		if (settings.maxFileSizeMB && fileSizeMB > settings.maxFileSizeMB) {
			throw new Error(
				`File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size of ${
					settings.maxFileSizeMB
				}MB`
			);
		}

		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = () => {
				resolve({
					data: reader.result as string,
					mimeType: file.type,
					filename: file.name,
					sizeInMB: fileSizeMB,
				});
			};

			reader.onerror = (error) => reject(new Error(`File reading failed: ${error}`));
			reader.readAsDataURL(file);
		});
	}

	/**
	 * Convert Base64 to File with enhanced error handling
	 * @param base64String Base64 encoded string
	 * @param filename Desired filename
	 * @param mimeType MIME type of the file
	 * @param options Configuration options
	 * @returns File object
	 */
	static base64ToFile(
		base64String: string,
		filename: string,
		mimeType: string,
		options: MediaConverterOptions = {}
	): File {
		const settings = { ...this.DEFAULT_OPTIONS, ...options };

		if (
			settings.validateContent &&
			!this.isValidMimeType(mimeType, settings.allowedMimeTypes!)
		) {
			throw new Error(`Unsupported MIME type: ${mimeType}`);
		}

		try {
			// Extract base64 data
			const base64Data = base64String.includes(',')
				? base64String.split(',')[1]
				: base64String;

			// Convert to blob with chunking for large files
			const byteCharacters = atob(base64Data);
			const byteArrays: Uint8Array[] = [];

			for (let offset = 0; offset < byteCharacters.length; offset += this.CHUNK_SIZE) {
				const slice = byteCharacters.slice(offset, offset + this.CHUNK_SIZE);
				const byteArray = new Uint8Array(slice.length);

				for (let i = 0; i < slice.length; i++) {
					byteArray[i] = slice.charCodeAt(i);
				}

				byteArrays.push(byteArray);
			}

			const blob = new Blob(byteArrays, { type: mimeType });

			// Validate size
			const fileSizeMB = blob.size / (1024 * 1024);
			if (settings.maxFileSizeMB && fileSizeMB > settings.maxFileSizeMB) {
				throw new Error(
					`Generated file exceeds maximum size limit of ${settings.maxFileSizeMB}MB`
				);
			}

			return new File([blob], filename, { type: mimeType });
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Base64 conversion failed: ${error.message}`);
			}
			throw new Error('Base64 conversion failed with unknown error');
		}
	}

	/**
	 * Convert URL to File with progress tracking
	 * @param url URL of the media file
	 * @param filename Optional filename
	 * @param options Configuration options
	 * @param onProgress Optional progress callback
	 * @returns Promise resolving to File object
	 */
	static async urlToFile(
		url: string,
		filename?: string,
		options: MediaConverterOptions = {},
		onProgress?: (progress: number) => void
	): Promise<File> {
		const settings = { ...this.DEFAULT_OPTIONS, ...options };

		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const contentType = response.headers.get('content-type') || 'application/octet-stream';

			if (
				settings.validateContent &&
				!this.isValidMimeType(contentType, settings.allowedMimeTypes!)
			) {
				throw new Error(`Unsupported content type: ${contentType}`);
			}

			const reader = response.body!.getReader();
			const contentLength = +(response.headers.get('content-length') || '0');
			let receivedLength = 0;
			const chunks: Uint8Array[] = [];

			while (true) {
				const { done, value } = await reader.read();

				if (done) break;

				chunks.push(value);
				receivedLength += value.length;

				if (onProgress && contentLength) {
					onProgress((receivedLength / contentLength) * 100);
				}
			}

			const blob = new Blob(chunks, { type: contentType });
			const finalFilename = filename || this.extractFilenameFromUrl(url);

			// Validate size
			const fileSizeMB = blob.size / (1024 * 1024);
			if (settings.maxFileSizeMB && fileSizeMB > settings.maxFileSizeMB) {
				throw new Error(
					`Downloaded file exceeds maximum size limit of ${settings.maxFileSizeMB}MB`
				);
			}

			return new File([blob], finalFilename, { type: contentType });
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`URL conversion failed: ${error.message}`);
			}
			throw new Error('URL conversion failed with unknown error');
		}
	}

	/**
	 * Convert File to URL with automatic cleanup
	 * @param file File object
	 * @returns Object URL and cleanup function
	 */
	static fileToUrl(file: File): { url: string; cleanup: () => void } {
		const url = URL.createObjectURL(file);
		return {
			url,
			cleanup: () => URL.revokeObjectURL(url),
		};
	}

	/**
	 * Calculate Base64 string size
	 * @param base64String Base64 string
	 * @returns Size in megabytes
	 */
	static getBase64Size(base64String: string): number {
		const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
		return (base64Data.length * 3) / 4 / (1024 * 1024);
	}

	private static isValidMimeType(mimeType: string, allowedTypes: string[]): boolean {
		return allowedTypes.some(
			(allowed) => mimeType === allowed || mimeType.startsWith(allowed.split('/')[0] + '/')
		);
	}

	private static extractFilenameFromUrl(url: string): string {
		try {
			const urlObject = new URL(url);
			const pathname = urlObject.pathname;
			const filename = pathname.split('/').pop();
			return filename || 'downloaded-file';
		} catch {
			return 'downloaded-file';
		}
	}
}

// Add default export
export default MediaConverter;

// Add global window export for direct script inclusion
if (typeof window !== 'undefined') {
	(window as any).MediaConverter = MediaConverter;
}
