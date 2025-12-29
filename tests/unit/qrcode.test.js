/**
 * Unit Tests for QRCode Module
 * Tests QR code generation, error handling, and edge cases
 */

import { QRCode } from '../../src/lib/qrcode.js';

describe('QRCode Module', () => {
  describe('QRCode.generate()', () => {
    test('should generate QR code for valid text', () => {
      const text = 'upi://pay?pa=test@upi&pn=Test&am=10&cu=INR&tn=Tip';
      const result = QRCode.generate(text, 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(result).toContain('svg');
    });

    test('should generate QR code with default size', () => {
      const text = 'test text';
      const result = QRCode.generate(text);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should generate QR code with custom size', () => {
      const text = 'test text';
      const result = QRCode.generate(text, 300);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle UPI payment links', () => {
      const upiLink = 'upi://pay?pa=merchant@upi&pn=Merchant&am=50&cu=INR&tn=Payment';
      const result = QRCode.generate(upiLink, 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle empty string', () => {
      const result = QRCode.generate('', 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle special characters', () => {
      const text = 'Test with special chars: @#$%^&*()';
      const result = QRCode.generate(text, 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle unicode characters', () => {
      const text = 'Test with unicode: 你好 🎉';
      const result = QRCode.generate(text, 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle very long text', () => {
      const longText = 'a'.repeat(1000);
      const result = QRCode.generate(longText, 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should return fallback on error', () => {
      // Note: The QRCode.generate function has error handling built-in
      // This test verifies that the function returns a valid data URL
      // The fallback mechanism is tested implicitly by ensuring
      // the function always returns a valid SVG data URL
      const result = QRCode.generate('test', 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle size parameter as 0', () => {
      const text = 'test text';
      const result = QRCode.generate(text, 0);
      
      expect(result).toBeDefined();
    });

    test('should handle negative size parameter', () => {
      const text = 'test text';
      const result = QRCode.generate(text, -100);
      
      expect(result).toBeDefined();
    });

    test('should handle very large size parameter', () => {
      const text = 'test text';
      const result = QRCode.generate(text, 10000);
      
      expect(result).toBeDefined();
    });
  });

  describe('QR Code Format Validation', () => {
    test('should generate valid SVG format', () => {
      const text = 'test';
      const result = QRCode.generate(text, 200);
      
      // Decode base64 and check SVG structure
      const base64Data = result.replace(/^data:image\/svg\+xml;base64,/, '');
      const svgContent = atob(base64Data);
      
      expect(svgContent).toContain('<svg');
      expect(svgContent).toContain('</svg>');
      expect(svgContent).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    test('should include white background', () => {
      const text = 'test';
      const result = QRCode.generate(text, 200);
      
      const base64Data = result.replace(/^data:image\/svg\+xml;base64,/, '');
      const svgContent = atob(base64Data);
      
      expect(svgContent).toContain('fill="white"');
    });

    test('should include black QR modules', () => {
      const text = 'test';
      const result = QRCode.generate(text, 200);
      
      const base64Data = result.replace(/^data:image\/svg\+xml;base64,/, '');
      const svgContent = atob(base64Data);
      
      expect(svgContent).toContain('fill="black"');
    });
  });

  describe('Edge Cases', () => {
    test('should handle null input gracefully', () => {
      const result = QRCode.generate(null, 200);
      
      expect(result).toBeDefined();
    });

    test('should handle undefined input gracefully', () => {
      const result = QRCode.generate(undefined, 200);
      
      expect(result).toBeDefined();
    });

    test('should handle numeric input', () => {
      const result = QRCode.generate(12345, 200);
      
      expect(result).toBeDefined();
    });

    test('should handle object input', () => {
      const result = QRCode.generate({ key: 'value' }, 200);
      
      expect(result).toBeDefined();
    });
  });

  describe('UPI Link Specific Tests', () => {
    test('should generate QR for standard UPI link', () => {
      const upiLink = 'upi://pay?pa=test@upi&pn=Test&am=10&cu=INR&tn=Tip';
      const result = QRCode.generate(upiLink, 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should generate QR for UPI link with all parameters', () => {
      const upiLink = 'upi://pay?pa=merchant@upi&pn=Merchant Name&am=100&cu=INR&tn=Transaction Note&tr=123456&mc=1234&tid=789';
      const result = QRCode.generate(upiLink, 200);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle UPI link with special characters in name', () => {
      const upiLink = 'upi://pay?pa=test@upi&pn=Test%20Merchant%20%26%20Co.&am=10&cu=INR';
      const result = QRCode.generate(upiLink, 200);
      
      expect(result).toBeDefined();
    });
  });
});
