export declare class MediaConverter {
    /**
     * Convert media file to Base64
     * @param file File object to convert
     * @returns Promise resolving to base64 string
     */
    static fileToBase64(file: File): Promise<string>;
    /**
     * Convert Base64 to File
     * @param base64String Base64 encoded string
     * @param filename Desired filename for the file
     * @param mimeType MIME type of the file
     * @returns File object
     */
    static base64ToFile(base64String: string, filename: string, mimeType: string): File;
    /**
     * Convert URL to File
     * @param url URL of the media file
     * @param filename Desired filename
     * @returns Promise resolving to File object
     */
    static urlToFile(url: string, filename?: string): Promise<File>;
    /**
     * Convert File to URL
     * @param file File object
     * @returns Object URL for the file
     */
    static fileToUrl(file: File): string;
}
export default MediaConverter;
