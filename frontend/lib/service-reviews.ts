/**
 * Service Review Library — Multi-Option
 *
 * Contains predefined professional Google review texts for all 51 canonical
 * services with Short, Medium, and Long variants (15 each = 45 per service).
 * Total: 51 × 45 = 2,295 reviews.
 *
 * Reviews use {company_name} as the only safe placeholder.
 *
 * Rules:
 * - No AI generation
 * - No external API
 * - Deterministic: same service + type always returns the same reviews
 * - Professional, positive, service-specific
 * - No exact claims about prices, timelines, or certifications
 */

import { BATCH_1 } from "./_review_batch_1";
import { BATCH_2 } from "./_review_batch_2";
import { BATCH_3 } from "./_review_batch_3";

export const CANONICAL_SERVICES = [
  "IT Services",
  "Software Development",
  "Web Development",
  "Digital Marketing",
  "Consulting",
  "Textile Trading",
  "Clothing & Apparel",
  "Real Estate",
  "Financial Services",
  "Accounting & Tax Services",
  "Legal Services",
  "Medical & Healthcare",
  "Clinic & Dental",
  "Cafe & Restaurant",
  "Food & Beverage",
  "Bakery & Confectionery",
  "Education & Coaching",
  "Gym & Fitness",
  "Beauty Salon & Spa",
  "Event Management",
  "Photography & Videography",
  "Interior Design",
  "Architecture & Construction",
  "Logistics & Transport",
  "E-commerce",
  "Retail Store",
  "Wholesale Trading",
  "Automobile Service",
  "Hotel & Hospitality",
  "Jewelry Store",
  "Manufacturing",
  "Graphic Design",
  "Public Relations",
  "Human Resources",
  "Cybersecurity",
  "Cloud Computing",
  "Agriculture & Farming",
  "Landscaping & Gardening",
  "Cleaning Services",
  "Pest Control",
  "Plumbing & Electrical",
  "Furniture & Home Decor",
  "Pet Care & Veterinary",
  "Travel & Tourism",
  "Insurance Agency",
  "Printing & Publishing",
  "Handicrafts & Artisans",
  "Pharmacy & Medical Supplies",
  "Entertainment & Media",
  "Waste Management",
  "Renewable Energy",
] as const;

export type CanonicalService = (typeof CANONICAL_SERVICES)[number];

export type ReviewType = "short" | "medium" | "long";

export interface ServiceReviews {
  short: string[];
  medium: string[];
  long: string[];
}

/** Combined review library from all batches */
export const SERVICE_REVIEW_LIBRARY: Record<CanonicalService, ServiceReviews> = {
  ...BATCH_1,
  ...BATCH_2,
  ...BATCH_3,
} as Record<CanonicalService, ServiceReviews>;

/** Reviews per service per type */
const REVIEWS_PER_CATEGORY = 15 as const;
/** Canonical service count */
const EXPECTED_SERVICE_COUNT = 51 as const;
/** Expected total review count */
const EXPECTED_TOTAL = EXPECTED_SERVICE_COUNT * REVIEWS_PER_CATEGORY * 3; // 2295

/**
 * Parse a business's services_products string into an array of canonical services.
 * Splits on newlines and commas, trims whitespace, and returns all tokens.
 */
export function parseBusinessServices(servicesProducts: string): string[] {
  if (!servicesProducts || !servicesProducts.trim()) return [];
  return servicesProducts
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Get all review options for a specific service and type.
 * Returns an array of 15 review strings, or an empty array if not found.
 */
export function getReviewsForService(
  service: string,
  reviewType: ReviewType
): string[] {
  const entry = SERVICE_REVIEW_LIBRARY[service as CanonicalService];
  if (!entry) return [];
  return entry[reviewType] || [];
}

/**
 * Get a single review text personalized with the company name.
 * Kept for backward compatibility; returns the first short review.
 */
export function getServiceReview(service: string, companyName: string): string | null {
  const entry = SERVICE_REVIEW_LIBRARY[service as CanonicalService];
  if (!entry) {
    return `We engaged ${companyName} for their ${service} services and were thoroughly impressed. The team was professional, reliable, and delivered excellent quality work. I highly recommend them to anyone looking for dependable ${service}.`;
  }
  return entry.short[0]?.replace(/\{company_name\}/g, companyName) || null;
}

/**
 * Personalize a review text by replacing {company_name} with the actual company name.
 */
export function personalizeReview(review: string, companyName: string): string {
  return review.replace(/\{company_name\}/g, companyName);
}

/**
 * Validate the complete review library.
 * Returns validation results or throws if critical checks fail.
 */
export function validateReviewLibrary(): {
  totalServices: number;
  totalShort: number;
  totalMedium: number;
  totalLong: number;
  totalReviews: number;
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const canonicalSet = new Set(CANONICAL_SERVICES);
  let totalShort = 0;
  let totalMedium = 0;
  let totalLong = 0;

  // Check all canonical services exist in library
  for (const service of CANONICAL_SERVICES) {
    const entry = SERVICE_REVIEW_LIBRARY[service];
    if (!entry) {
      errors.push(`Missing service: ${service}`);
      continue;
    }
    if (!Array.isArray(entry.short) || entry.short.length !== REVIEWS_PER_CATEGORY) {
      errors.push(`${service}: short reviews count is ${entry.short?.length ?? 0}, expected ${REVIEWS_PER_CATEGORY}`);
    }
    if (!Array.isArray(entry.medium) || entry.medium.length !== REVIEWS_PER_CATEGORY) {
      errors.push(`${service}: medium reviews count is ${entry.medium?.length ?? 0}, expected ${REVIEWS_PER_CATEGORY}`);
    }
    if (!Array.isArray(entry.long) || entry.long.length !== REVIEWS_PER_CATEGORY) {
      errors.push(`${service}: long reviews count is ${entry.long?.length ?? 0}, expected ${REVIEWS_PER_CATEGORY}`);
    }
    totalShort += entry.short?.length ?? 0;
    totalMedium += entry.medium?.length ?? 0;
    totalLong += entry.long?.length ?? 0;

    // Check for empty reviews
    for (const type of ["short", "medium", "long"] as const) {
      const reviews = entry[type];
      if (!reviews) continue;
      for (let i = 0; i < reviews.length; i++) {
        if (!reviews[i] || !reviews[i].trim()) {
          errors.push(`${service}: ${type}[${i}] is empty`);
        }
      }
    }

    // Check for exact duplicates within each type
    for (const type of ["short", "medium", "long"] as const) {
      const reviews = entry[type];
      if (!reviews) continue;
      const normalized = reviews.map((r) => r.toLowerCase().trim());
      const seen = new Set<string>();
      for (let i = 0; i < normalized.length; i++) {
        if (seen.has(normalized[i])) {
          errors.push(`${service}: exact duplicate in ${type} at index ${i}`);
        }
        seen.add(normalized[i]);
      }
    }
  }

  // Check for extra keys in library not in canonical list
  const libraryKeys = Object.keys(SERVICE_REVIEW_LIBRARY);
  for (const key of libraryKeys) {
    if (!canonicalSet.has(key as CanonicalService)) {
      errors.push(`Extra key in library not in canonical list: ${key}`);
    }
  }

  const totalReviews = totalShort + totalMedium + totalLong;

  return {
    totalServices: libraryKeys.length,
    totalShort,
    totalMedium,
    totalLong,
    totalReviews,
    isValid:
      errors.length === 0 &&
      libraryKeys.length === EXPECTED_SERVICE_COUNT &&
      totalReviews === EXPECTED_TOTAL,
    errors,
  };
}

// Run validation in development
if (process.env.NODE_ENV === "development") {
  const result = validateReviewLibrary();
  if (!result.isValid) {
    console.error("Review library validation FAILED:", result.errors);
  } else {
    console.log(
      `Review library validation passed: ${result.totalServices} services, ${result.totalShort} short, ${result.totalMedium} medium, ${result.totalLong} long, ${result.totalReviews} total`
    );
  }
}
