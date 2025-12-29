/**
 * ChaiPe.js - QR Code Generator Module
 * Generates QR codes as SVG data URLs for UPI payment links using qrcode-generator library
 * @module lib/qrcode
 */

import qrcode from 'qrcode-generator';

/**
 * Generate SVG data URL for QR code using qrcode-generator library
 * @param {string} text - Text to encode
 * @param {number} size - Size of the QR code
 * @returns {string} SVG data URL
 */
function generateSVG(text, size) {
    // Create QR code with auto-detection (typeNumber 0) and medium error correction
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    
    // Get the module count (size of QR matrix)
    const moduleCount = qr.getModuleCount();
    
    // Calculate cell size to fit the requested size
    const cellSize = Math.floor(size / moduleCount);
    const actualSize = cellSize * moduleCount;
    
    // Build SVG string
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${actualSize}" height="${actualSize}" viewBox="0 0 ${moduleCount} ${moduleCount}">`;
    svg += `<rect width="100%" height="100%" fill="white"/>`;
    
    // Add QR modules
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
                svg += `<rect x="${col}" y="${row}" width="1" height="1" fill="black"/>`;
            }
        }
    }
    svg += '</svg>';
    
    // Return as base64 data URL
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

/**
 * QRCode module for generating UPI QR codes using qrcode-generator library
 */
export const QRCode = {
    /**
     * Generate a QR code as a data URL
     * @param {string} text - Text to encode (typically a UPI link)
     * @param {number} [size=200] - Size of the QR code in pixels
     * @returns {string} Data URL of the generated QR code
     */
    generate: function (text, size) {
        size = size || 200;
        try {
            return generateSVG(text, size);
        } catch (e) {
            console.error('QR generation failed:', e);
            // Fallback: return a placeholder
            return 'data:image/svg+xml;base64,' + btoa(
                `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
                    <rect width="100%" height="100%" fill="#f0f0f0"/>
                    <text x="50%" y="50%" text-anchor="middle" fill="#666" font-size="12">QR Error</text>
                </svg>`
            );
        }
    }
};

export default QRCode;
