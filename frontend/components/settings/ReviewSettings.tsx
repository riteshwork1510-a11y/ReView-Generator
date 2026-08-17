import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./SettingsSection";
import { z } from "zod";

import { ApplicationSettingsFormValues } from "@/types/settings";

export const reviewSettingsSchema = z.object({
  review_cta_text: z.string().trim().min(1, "Review CTA text cannot be empty").max(60, "Maximum 60 characters allowed"),
  show_google_review_button: z.boolean(),
});

interface ReviewSettingsProps {
  form: UseFormReturn<ApplicationSettingsFormValues>;
}

export function ReviewSettings({ form }: ReviewSettingsProps) {
  return (
    <SettingsSection 
      title="Review Configuration" 
      description="Configure Google Review CTA settings. Note: Google Review URLs are configured individually for each business from the Review Generator form."
    >
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="show_google_review_button"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-0.5 pr-4">
                <FormLabel className="text-base font-medium text-slate-900">Show Google Review Button</FormLabel>
                <FormDescription className="text-slate-500">
                  Enable or disable the Google Review CTA on all business digital cards. This does not delete the configured URLs.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="review_cta_text"
          render={({ field }) => (
            <FormItem className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <FormLabel className="text-base font-medium text-slate-900">Review CTA Text</FormLabel>
              <div className="mt-2">
                <FormControl>
                  <Input placeholder="Give 5-Star Google Review" {...field} />
                </FormControl>
                <FormDescription className="text-slate-500 mt-2">
                  The primary review CTA label. Plain text only. Max 60 characters.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </SettingsSection>
  );
}
