import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "./SettingsSection";
import { z } from "zod";

import { ApplicationSettingsFormValues } from "@/types/settings";

export const generalSettingsSchema = z.object({
  application_name: z.string().trim().min(1, "Application name cannot be empty").max(100),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

interface GeneralSettingsProps {
  form: UseFormReturn<ApplicationSettingsFormValues>;
}

export function GeneralSettings({ form }: GeneralSettingsProps) {
  return (
    <SettingsSection 
      title="General" 
      description="Basic application settings."
    >
      <FormField
        control={form.control}
        name="application_name"
        render={({ field }) => (
          <FormItem className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <FormLabel className="text-base font-medium text-slate-900">Application Name</FormLabel>
            <div className="mt-2">
              <FormControl>
                <Input placeholder="AI Review Generator" {...field} />
              </FormControl>
              <FormMessage className="mt-2" />
            </div>
          </FormItem>
        )}
      />
    </SettingsSection>
  );
}
