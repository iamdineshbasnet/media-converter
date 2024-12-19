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
export declare class MediaConverter {
    private static readonly DEFAULT_OPTIONS;
    private static readonly CHUNK_SIZE;
    /**
     * Convert media file to Base64 with validation and metadata
     * @param file File object to convert
     * @param options Configuration options
     * @returns Promise resolving to conversion result
     */
    static fileToBase64(file: File, options?: MediaConverterOptions): Promise<ConversionResult>;
    /**
     * Convert Base64 to File with enhanced error handling
     * @param base64String Base64 encoded string
     * @param filename Desired filename
     * @param mimeType MIME type of the file
     * @param options Configuration options
     * @returns File object
     */
    static base64ToFile(base64String: string, filename: string, mimeType: string, options?: MediaConverterOptions): File;
    /**
     * Convert URL to File with progress tracking
     * @param url URL of the media file
     * @param filename Optional filename
     * @param options Configuration options
     * @param onProgress Optional progress callback
     * @returns Promise resolving to File object
     */
    static urlToFile(url: string, filename?: string, options?: MediaConverterOptions, onProgress?: (progress: number) => void): Promise<File>;
    /**
     * Convert File to URL with automatic cleanup
     * @param file File object
     * @returns Object URL and cleanup function
     */
    static fileToUrl(file: File): {
        url: string;
        cleanup: () => void;
    };
    /**
     * Calculate Base64 string size
     * @param base64String Base64 string
     * @returns Size in megabytes
     */
    static getBase64Size(base64String: string): number;
    private static isValidMimeType;
    private static extractFilenameFromUrl;
}
export default MediaConverter;
