/**
 * Test suite for Climate Assistant Gated Routes - JWT Authentication
 * Tests the security fix for proper JWT token validation
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';
import climateAssistantGatedRoutes from '../routes/climate-assistant-gated.routes.js';
import AuthService from '../services/auth.service.js';

// Shared rate-limit counter — reset between tests so each test starts clean
const { rateLimitCounts } = vi.hoisted(() => ({
  rateLimitCounts: new Map<string, number>(),
}));

// Mock express-rate-limit so each test gets a fresh quota
vi.mock('express-rate-limit', () => ({
  default: (opts: { max?: number; message?: Record<string, string> }) => {
    const max = opts?.max ?? 5;
    return (req: any, res: any, next: any) => {
      const key = req.ip || '127.0.0.1';
      const count = (rateLimitCounts.get(key) || 0) + 1;
      rateLimitCounts.set(key, count);
      if (count > max) {
        return res.status(429).json(opts?.message || { error: 'Too many requests' });
      }
      next();
    };
  },
}));

// Mock the logger to avoid console spam
vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the GatedService
vi.mock('../services/climate-assistant-gated.service.js', () => ({
  default: {
    processGatedMessage: vi.fn().mockResolvedValue({
      content: 'Test response',
      model: 'llama-3.3-70b-versatile',
      tier: 'guest',
      messagesUsed: 1,
      messagesRemaining: 9,
      showLeadCapture: false,
    }),
    captureLeadData: vi.fn(),
    upgradeSessionTier: vi.fn(),
  },
}));

describe('Climate Assistant Gated Routes - JWT Authentication Security', () => {
  let app: Express;
  let validToken: string;
  let invalidToken: string;

  beforeEach(() => {
    // Reset rate limiter counts so each test starts with fresh quota
    rateLimitCounts.clear();

    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    app.use('/api/climate-assistant', climateAssistantGatedRoutes);

    // Generate a valid JWT token for testing
    validToken = AuthService.generateAccessToken({
      id: 'test-user-123',
      email: 'test@example.com',
      role: 'dws_iq_standard',
      accessLevel: 'free',
    });

    // Create an invalid token
    invalidToken = 'invalid.jwt.token';
  });

  describe('POST /api/climate-assistant/chat - Authentication Security', () => {
    const validRequest = {
      message: 'What are the CSRD reporting requirements?',
      sessionId: 'test-session-123',
      tier: 'public',
    };

    it('should allow public tier access without authentication', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should upgrade to guest tier with valid JWT token', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // The tier should be upgraded to 'guest' for authenticated users
      expect(response.body.tier).toBe('guest');
    });

    it('should NOT upgrade tier with invalid JWT token', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // The tier should remain 'public' because token validation failed
      expect(response.body.tier).not.toBe('guest');
    });

    it('should NOT upgrade tier with empty Bearer token', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .set('Authorization', 'Bearer ')
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // The tier should remain 'public' because no token was provided
      expect(response.body.tier).not.toBe('guest');
    });

    it('should NOT upgrade tier with malformed authorization header', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .set('Authorization', 'NotBearer sometoken')
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // The tier should remain 'public' because header format is wrong
      expect(response.body.tier).not.toBe('guest');
    });

    it('should NOT upgrade tier with just "Bearer" keyword', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .set('Authorization', 'Bearer')
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // The tier should remain 'public'
      expect(response.body.tier).not.toBe('guest');
    });

    it('should validate request even without authorization header', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject requests with invalid message format', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          message: '', // Empty message
          sessionId: 'test-session-123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });

    it('should reject requests with missing sessionId', async () => {
      const response = await request(app)
        .post('/api/climate-assistant/chat')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          message: 'Test message',
          // sessionId is missing
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('Rate Limiting Behavior', () => {
    it('should apply rate limiting to unauthenticated requests', async () => {
      const validRequest = {
        message: 'What is CSRD?',
        sessionId: 'test-session-rate-limit',
      };

      // Make 6 requests (public limit is 5 per minute)
      const requests = Array(6).fill(null).map(() =>
        request(app)
          .post('/api/climate-assistant/chat')
          .send(validRequest)
      );

      const responses = await Promise.all(requests);
      
      // Last request should be rate limited
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
    });
  });
});
