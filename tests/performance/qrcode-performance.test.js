/**
 * Performance Tests for QR Code Generation
 * Tests execution speed and performance characteristics
 */

import { QRCode } from '../../src/lib/qrcode.js';

describe('QR Code Performance Tests', () => {
  const testUPI = 'upi://pay?pa=merchant@upi&pn=Merchant&am=100&cu=INR&tn=Test';
  const iterations = 100;

  describe('Performance Benchmarks', () => {
    test('should generate QR codes efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        QRCode.generate(testUPI, 200);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;
      
      // Performance assertion: average time should be reasonable (< 10ms per QR code)
      expect(avgTime).toBeLessThan(10);
      
      // Should generate at least 50 QR codes per second
      const qrPerSecond = 1000 / avgTime;
      expect(qrPerSecond).toBeGreaterThan(50);
    });

    test('should handle performance with different data sizes', () => {
      const testCases = [
        { 
          name: 'Short UPI link', 
          data: 'upi://pay?pa=merchant@upi&am=10&cu=INR',
          expectedMaxTime: 5
        },
        { 
          name: 'Medium UPI link', 
          data: 'upi://pay?pa=merchant@upi&pn=Merchant&am=100&cu=INR&tn=Test',
          expectedMaxTime: 8
        },
        { 
          name: 'Long UPI link', 
          data: 'upi://pay?pa=verylongmerchantname@upi&pn=Very%20Long%20Merchant%20Name%20Limited&am=500&cu=INR&tn=Payment%20for%20services%20rendered',
          expectedMaxTime: 15
        }
      ];

      testCases.forEach(testCase => {
        const start = performance.now();
        const qr = QRCode.generate(testCase.data, 200);
        const end = performance.now();
        const time = end - start;

        expect(qr).toBeDefined();
        expect(qr).toMatch(/^data:image\/svg\+xml;base64,/);
        expect(time).toBeLessThan(testCase.expectedMaxTime);
      });
    });

    test('should handle performance with different sizes', () => {
      const sizes = [100, 200, 300, 400];
      
      sizes.forEach(size => {
        const start = performance.now();
        const qr = QRCode.generate(testUPI, size);
        const end = performance.now();
        const time = end - start;

        expect(qr).toBeDefined();
        expect(time).toBeLessThan(20); // Should complete within 20ms for any size
      });
    });

    test('should maintain consistent performance across multiple generations', () => {
      const times = [];
      const testIterations = 50;

      for (let i = 0; i < testIterations; i++) {
        const start = performance.now();
        QRCode.generate(testUPI, 200);
        const end = performance.now();
        times.push(end - start);
      }

      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);

      // Performance should be consistent (max shouldn't be more than 5x average)
      expect(maxTime).toBeLessThan(avgTime * 5);
      expect(avgTime).toBeLessThan(10);
    });
  });

  describe('Memory Efficiency', () => {
    test('should not cause memory leaks with repeated generation', () => {
      const initialMemory = performance.memory?.usedJSHeapSize;
      
      // Generate many QR codes
      for (let i = 0; i < 1000; i++) {
        QRCode.generate(testUPI, 200);
      }

      const finalMemory = performance.memory?.usedJSHeapSize;
      
      // If memory API is available, check for reasonable growth
      if (initialMemory && finalMemory) {
        const memoryGrowth = finalMemory - initialMemory;
        // Memory growth should be reasonable (< 10MB for 1000 QR codes)
        expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
      }
    });
  });

  describe('Performance Edge Cases', () => {
    test('should handle very long text efficiently', () => {
      const longText = 'a'.repeat(1000);
      
      const start = performance.now();
      const qr = QRCode.generate(longText, 200);
      const end = performance.now();
      
      expect(qr).toBeDefined();
      expect(end - start).toBeLessThan(50); // Should complete within 50ms
    });

    test('should handle special characters efficiently', () => {
      const specialChars = 'Test with special chars: @#$%^&*()_+-=[]{}|;:,.<>?/~`';
      
      const start = performance.now();
      const qr = QRCode.generate(specialChars, 200);
      const end = performance.now();
      
      expect(qr).toBeDefined();
      expect(end - start).toBeLessThan(10);
    });

    test('should handle unicode characters efficiently', () => {
      const unicodeText = 'Test with unicode: 你好 🎉 العربية 日本語 한국어';
      
      const start = performance.now();
      const qr = QRCode.generate(unicodeText, 200);
      const end = performance.now();
      
      expect(qr).toBeDefined();
      expect(end - start).toBeLessThan(15);
    });
  });
});
