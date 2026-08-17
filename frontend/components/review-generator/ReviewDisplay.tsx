"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ExternalLink, AlertCircle, Check, RefreshCw, Copy, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanonicalService } from "@/lib/service-reviews";
import Link from "next/link";

type ActionState =
  | "auto-copying"   // attempting clipboard on mount
  | "auto-copied"    // auto-copy succeeded → show open button
  | "idle"           // auto-copy failed → show manual CTA
  | "loading"        // manual button clicked
  | "success"        // manual click: copy + open succeeded
  | "clipboard-error"
  | "popup-blocked";

interface ReviewDisplayProps {
  service: string;
  reviewText: string;
  googleReviewUrl?: string;
  onRegenerate?: () => void;
}

// Validate that a URL is a safe https:// URL
function isSafeUrl(url?: string): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Five filled stars component
function FiveStars({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "lg"
      ? "w-8 h-8"
      : size === "md"
      ? "w-6 h-6"
      : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${cls} text-yellow-400 fill-yellow-400`} />
      ))}
    </div>
  );
}

export function ReviewDisplay({
  service,
  reviewText,
  googleReviewUrl,
  onRegenerate,
}: ReviewDisplayProps) {
  const [state, setState] = useState<ActionState>("auto-copying");
  // Track whether we've already attempted auto-copy for this reviewText
  const hasAutoAttempted = useRef(false);
  // Track the reviewText that was auto-copied (to reset on service change)
  const autoCopiedFor = useRef<string>("");

  const hasValidGoogleUrl = isSafeUrl(googleReviewUrl);

  // ── Auto-copy on mount / when reviewText changes ───────────────────────────
  useEffect(() => {
    if (!reviewText) return;

    // If the text changed since last auto-copy, reset and re-attempt
    if (hasAutoAttempted.current && autoCopiedFor.current !== reviewText) {
      hasAutoAttempted.current = false;
      autoCopiedFor.current = "";
    }

    if (hasAutoAttempted.current) return;
    hasAutoAttempted.current = true;

    const attemptAutoCopy = async () => {
      try {
        await navigator.clipboard.writeText(reviewText);
        
        // Send to Chrome extension for auto-fill
        window.postMessage({ type: 'REVIEW_GENERATOR_DATA_TO_EXT', reviewText }, '*');

        autoCopiedFor.current = reviewText;
        setState("auto-copied");
      } catch {
        setState("idle");
      }
    };

    attemptAutoCopy();
  }, [reviewText]);

  // ── Manual "Copy Review & Open Google Review" handler ─────────────────────
  const handleCopyAndOpen = async () => {
    setState("loading");

    // STEP 1 — Copy to clipboard & send to extension
    try {
      await navigator.clipboard.writeText(reviewText);
      window.postMessage({ type: 'REVIEW_GENERATOR_DATA_TO_EXT', reviewText }, '*');
    } catch {
      setState("clipboard-error");
      return;
    }

    // STEP 2 — Open Google Review (synchronous in click handler = popup-safe)
    const newTab = window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
    if (newTab === null) {
      setState("popup-blocked");
      return;
    }

    setState("success");
  };

  // ── Open Google (used from auto-copied state) ─────────────────────────────
  const handleOpenGoogle = () => {
    const newTab = window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
    if (newTab === null) {
      setState("popup-blocked");
    }
  };

  const isLoading = state === "loading";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Service label */}
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
        <span className="text-sm font-bold text-slate-800">{service}</span>
        <span className="text-xs text-slate-400 font-medium">— Review Ready</span>
      </div>

      {/* Review text card — always visible */}
      <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Your Review
        </p>
        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
          {reviewText}
        </p>
      </div>

      {/* Re-Generate button — directly below the review text */}
      {onRegenerate && (
        <div className="flex justify-center">
          <Button
            id="regenerate-review-btn"
            variant="outline"
            onClick={onRegenerate}
            className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300"
          >
            <Shuffle className="w-4 h-4" />
            Re-Generate Review
          </Button>
        </div>
      )}

      {/* ── No Google URL configured ───────────────────────────────────────── */}
      {!hasValidGoogleUrl && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium">
              Google Review link is not configured for this business.
            </p>
          </div>
          <p className="text-xs text-amber-700 pl-6">
            Add a Google Review URL in the Digital Card settings to enable one-click reviews.
          </p>
          <div className="pl-6">
            <Link
              href="/digital-cards"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Edit Digital Card
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ── CTA area — only when Google URL is valid ──────────────────────── */}
      {hasValidGoogleUrl && (
        <div className="space-y-4">

          {/* ── AUTO-COPYING: brief loading indicator ── */}
          {state === "auto-copying" && (
            <div className="flex items-center justify-center gap-2 py-3 text-slate-400 text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Preparing your review...
            </div>
          )}

          {/* ── AUTO-COPIED: ready to go — just open Google ── */}
          {state === "auto-copied" && (
            <div className="space-y-4">
              {/* Success banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
                {/* Status */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      ✓ Review copied to clipboard
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Your {service} review is ready to paste on Google.
                    </p>
                  </div>
                </div>

                {/* 5-star visual */}
                <div className="bg-white border border-emerald-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Select on Google
                    </p>
                    <FiveStars size="lg" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">5 Stars</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">★ Recommended</p>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    Next steps in Google:
                  </p>
                  <ol className="space-y-1.5">
                    {[
                      { n: "1", emoji: "⭐⭐⭐⭐⭐", text: "Select 5 stars" },
                      { n: "2", emoji: "📋", text: "Paste your copied review (Ctrl+V)" },
                      { n: "3", emoji: "✅", text: "Submit your review" },
                    ].map(({ n, emoji, text }) => (
                      <li key={n} className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                        <span className="w-4 text-center text-slate-400 shrink-0">{n}.</span>
                        <span>{emoji}</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Open Google button */}
              <Button
                id="open-google-review-btn"
                aria-label="Open Google Review in a new tab"
                onClick={handleOpenGoogle}
                className="w-full h-12 gap-2.5 font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                Open Google Review
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </Button>

              <p className="text-center text-xs text-slate-400">
                Review already copied — just paste &amp; select 5 stars on Google
              </p>
            </div>
          )}

          {/* ── IDLE: auto-copy failed, show manual CTA ── */}
          {state === "idle" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 text-center font-medium">
                ⭐ Ready to leave your review?
              </p>
              <Button
                id="copy-and-open-google-review-btn"
                aria-label="Copy review and open Google Review in a new tab"
                onClick={handleCopyAndOpen}
                className="w-full h-12 gap-2.5 font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                Copy Review &amp; Open Google Review
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </Button>
            </div>
          )}

          {/* ── LOADING ── */}
          {isLoading && (
            <Button
              disabled
              className="w-full h-12 gap-2.5 font-semibold text-sm bg-indigo-400 text-white cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              Opening Google Review...
            </Button>
          )}

          {/* ── SUCCESS (manual flow) ── */}
          {state === "success" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      ✓ Review copied &amp; Google Review opened
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Google Review is now open in a new tab.
                    </p>
                  </div>
                </div>

                {/* 5-star visual */}
                <div className="bg-white border border-emerald-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Select on Google
                    </p>
                    <FiveStars size="lg" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">5 Stars</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">★ Recommended</p>
                  </div>
                </div>

                <ol className="space-y-1.5">
                  {[
                    { n: "1", emoji: "⭐⭐⭐⭐⭐", text: "Select 5 stars" },
                    { n: "2", emoji: "📋", text: "Paste your copied review (Ctrl+V)" },
                    { n: "3", emoji: "✅", text: "Submit your review" },
                  ].map(({ n, emoji, text }) => (
                    <li key={n} className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                      <span className="w-4 text-center text-slate-400 shrink-0">{n}.</span>
                      <span>{emoji}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>

                <a
                  id="open-google-review-again-btn"
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline py-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Google Review Again
                </a>
              </div>
            </div>
          )}

          {/* ── CLIPBOARD ERROR ── */}
          {state === "clipboard-error" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to copy the review automatically.
                  </p>
                  <p className="text-xs text-red-700 mt-0.5">
                    Please copy the review text above manually, then open Google Review.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-6">
                <button
                  onClick={() => setState("idle")}
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Try again
                </button>
                <span className="text-slate-300">|</span>
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  Open Google <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* ── POPUP BLOCKED ── */}
          {state === "popup-blocked" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Review copied — popup was blocked.
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Your browser blocked the new tab. Click below to open Google Review.
                  </p>
                </div>
              </div>
              <div className="pl-6">
                <a
                  id="open-google-review-fallback-btn"
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Open Google Review <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
