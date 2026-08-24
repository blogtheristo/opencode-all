// Zod schemas for the /playbooks/ edge functions.
// All untrusted input crosses one of these before touching the DB or SES.
import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { INDUSTRY_SLUGS } from './industries.ts';

const LANGUAGES = ['en', 'fi', 'sv', 'de', 'fr'] as const;

const utmSchema = z
  .object({
    source: z.string().max(120).optional(),
    medium: z.string().max(120).optional(),
    campaign: z.string().max(120).optional(),
    term: z.string().max(120).optional(),
    content: z.string().max(120).optional(),
  })
  .optional();

export const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  industry: z.enum(INDUSTRY_SLUGS),
  language: z.enum(LANGUAGES).default('en'),
  consent_marketing: z.boolean(),
  consent_text: z.string().min(20).max(2000),
  utm: utmSchema,
});

export type RequestInput = z.infer<typeof requestSchema>;

// 6-char Crockford-base32-ish alphabet (no I, O, 0, 1, L, U for clarity).
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
const CODE_REGEX = new RegExp(`^[${CODE_ALPHABET}]{6}$`);

export const verifySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  industry: z.enum(INDUSTRY_SLUGS),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .length(6)
    .regex(CODE_REGEX, 'code must be 6 chars from the playbook alphabet'),
});

export type VerifyInput = z.infer<typeof verifySchema>;
