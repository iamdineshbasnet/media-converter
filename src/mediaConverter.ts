export class MediaConverter {
	/**
	 * Convert media file to Base64
	 * @param file File object to convert
	 * @returns Promise resolving to base64 string
	 */
	static async fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	}

	/**
	 * Convert Base64 to File
	 * @param base64String Base64 encoded string
	 * @param filename Desired filename for the file
	 * @param mimeType MIME type of the file
	 * @returns File object
	 */
	static base64ToFile(base64String: string, filename: string, mimeType: string): File {
		// Remove data URL prefix if present
		const base64Data = base64String.split(',')[1] || base64String;

		// Convert base64 to blob
		const byteCharacters = atob(base64Data);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += 512) {
			const slice = byteCharacters.slice(offset, offset + 512);
			const byteNumbers = new Array(slice.length);

			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
      // @ts-ignore
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: mimeType });
		return new File([blob], filename, { type: mimeType });
	}

	/**
	 * Convert URL to File
	 * @param url URL of the media file
	 * @param filename Desired filename
	 * @returns Promise resolving to File object
	 */
	static async urlToFile(url: string, filename?: string): Promise<File> {
		const response = await fetch(url);
		const blob = await response.blob();
		const mimeType = response.headers.get('content-type') || 'application/octet-stream';

		// Use provided filename or extract from URL
		const finalFilename = filename || url.split('/').pop() || 'downloaded-file';

		return new File([blob], finalFilename, { type: mimeType });
	}

	/**
	 * Convert File to URL
	 * @param file File object
	 * @returns Object URL for the file
	 */
	static fileToUrl(file: File): string {
		return URL.createObjectURL(file);
	}
}
