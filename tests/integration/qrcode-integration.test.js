/**
 * Integration Tests for QR Code Generation
 * Tests QR code generation with various inputs and scenarios
 */

import { QRCode } from '../../src/lib/qrcode.js';

describe('QR Code Integration Tests', () => {
  describe('UPI Link Generation', () => {
    test('should generate QR code for basic UPI link', () => {
      const testUPI = 'upi://pay?pa=merchant@upi&pn=Merchant&am=100&cu=INR&tn=Test';
      
      const qr = QRCode.generate(testUPI, 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(qr.length).toBeGreaterThan(100);
    });

    test('should generate QR code for longer UPI link', () => {
      const testLongUPI = 'upi://pay?pa=verylongmerchantname@upi&pn=Very%20Long%20Merchant%20Name%20Limited&am=500&cu=INR&tn=Payment%20for%20services%20rendered%20in%20December%202024';
      
      const qr = QRCode.generate(testLongUPI, 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(qr.length).toBeGreaterThan(100);
    });

    test('should handle UPI link with all parameters', () => {
      const fullUPI = 'upi://pay?pa=merchant@upi&pn=Merchant Name&am=100&cu=INR&tn=Transaction Note&tr=123456&mc=1234&tid=789';
      
      const qr = QRCode.generate(fullUPI, 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle UPI link with special characters', () => {
      const specialUPI = 'upi://pay?pa=test@upi&pn=Test%20Merchant%20%26%20Co.&am=10&cu=INR';
      
      const qr = QRCode.generate(specialUPI, 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });
  });

  describe('QR Code Size Variations', () => {
    test('should generate QR code for size 100px', () => {
      const qr = QRCode.generate('test', 100);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should generate QR code for size 200px', () => {
      const qr = QRCode.generate('test', 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should generate QR code for size 300px', () => {
      const qr = QRCode.generate('test', 300);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should generate QR code for size 400px', () => {
      const qr = QRCode.generate('test', 400);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should generate larger data URL for larger size', () => {
      const qr100 = QRCode.generate('test', 100);
      const qr400 = QRCode.generate('test', 400);
      
      expect(qr400.length).toBeGreaterThanOrEqual(qr100.length);
    });
  });

  describe('Data URL Format Validation', () => {
    test('should produce valid base64 encoded SVG', () => {
      const qr = QRCode.generate('test', 200);
      
      // Check data URL prefix
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
      
      // Decode and validate SVG structure
      const base64Data = qr.replace(/^data:image\/svg\+xml;base64,/, '');
      const svgContent = atob(base64Data);
      
      expect(svgContent).toContain('<svg');
      expect(svgContent).toContain('</svg>');
      expect(svgContent).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    test('should include QR code modules in SVG', () => {
      const qr = QRCode.generate('test', 200);
      
      const base64Data = qr.replace(/^data:image\/svg\+xml;base64,/, '');
      const svgContent = atob(base64Data);
      
      // Should contain QR code rectangles
      expect(svgContent).toContain('<rect');
    });

    test('should include white background', () => {
      const qr = QRCode.generate('test', 200);
      
      const base64Data = qr.replace(/^data:image\/svg\+xml;base64,/, '');
      const svgContent = atob(base64Data);
      
      expect(svgContent).toContain('fill="white"');
    });

    test('should include black QR modules', () => {
      const qr = QRCode.generate('test', 200);
      
      const base64Data = qr.replace(/^data:image\/svg\+xml;base64,/, '');
      const svgContent = atob(base64Data);
      
      expect(svgContent).toContain('fill="black"');
    });
  });

  describe('Real-World Scenarios', () => {
    test('should handle typical ChaiPe UPI payment link', () => {
      const chaipeUPI = 'upi://pay?pa=creator@upi&pn=Creator%20Name&am=50&cu=INR&tn=Tip%20via%20ChaiPe';
      
      const qr = QRCode.generate(chaipeUPI, 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle multiple different UPI links', () => {
      const upiLinks = [
        'upi://pay?pa=user1@upi&pn=User%201&am=10&cu=INR',
        'upi://pay?pa=user2@upi&pn=User%202&am=25&cu=INR&tn=Donation',
        'upi://pay?pa=user3@upi&pn=User%203&am=100&cu=INR&tn=Support',
        'upi://pay?pa=user4@upi&pn=User%204&am=500&cu=INR&tn=Premium'
      ];

      upiLinks.forEach(link => {
        const qr = QRCode.generate(link, 200);
        expect(qr).toBeDefined();
        expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
      });
    });

    test('should handle different amounts in UPI links', () => {
      const amounts = [1, 5, 10, 25, 50, 100, 500, 1000];
      
      amounts.forEach(amount => {
        const upiLink = `upi://pay?pa=merchant@upi&pn=Merchant&am=${amount}&cu=INR`;
        const qr = QRCode.generate(upiLink, 200);
        
        expect(qr).toBeDefined();
        expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle empty string', () => {
      const qr = QRCode.generate('', 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle very long text', () => {
      const longText = 'a'.repeat(1000);
      const qr = QRCode.generate(longText, 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle special characters', () => {
      const specialChars = 'Test with special chars: @#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const qr = QRCode.generate(specialChars, 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle unicode characters', () => {
      const unicodeText = 'Test with unicode: 你好 🎉 العربية 日本語 한국어';
      const qr = QRCode.generate(unicodeText, 200);
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle null input gracefully', () => {
      const qr = QRCode.generate(null, 200);
      
      expect(qr).toBeDefined();
    });

    test('should handle undefined input gracefully', () => {
      const qr = QRCode.generate(undefined, 200);
      
      expect(qr).toBeDefined();
    });

    test('should handle numeric input', () => {
      const qr = QRCode.generate(12345, 200);
      
      expect(qr).toBeDefined();
    });

    test('should handle object input', () => {
      const qr = QRCode.generate({ key: 'value' }, 200);
      
      expect(qr).toBeDefined();
    });
  });

  describe('Default Size Handling', () => {
    test('should use default size when not specified', () => {
      const qr = QRCode.generate('test');
      
      expect(qr).toBeDefined();
      expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    test('should handle size parameter as 0', () => {
      const qr = QRCode.generate('test', 0);
      
      expect(qr).toBeDefined();
    });

    test('should handle negative size parameter', () => {
      const qr = QRCode.generate('test', -100);
      
      expect(qr).toBeDefined();
    });

    test('should handle very large size parameter', () => {
      const qr = QRCode.generate('test', 10000);
      
      expect(qr).toBeDefined();
    });
  });
});
