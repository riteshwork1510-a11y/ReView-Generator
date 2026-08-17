import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./SettingsSection";
import { z } from "zod";

import { ApplicationSettingsFormValues } from "@/types/settings";

export const contactActionSettingsSchema = z.object({
  show_call_action: z.boolean(),
  show_whatsapp_action: z.boolean(),
  show_email_action: z.boolean(),
  show_website_action: z.boolean(),
});

interface ContactActionSettingsProps {
  form: UseFormReturn<ApplicationSettingsFormValues>;
}

export function ContactActionSettings({ form }: ContactActionSettingsProps) {
  const actions = [
    { name: "show_call_action", label: "Show Call Action", desc: "Display the Call button." },
    { name: "show_whatsapp_action", label: "Show WhatsApp Action", desc: "Display the WhatsApp button." },
    { name: "show_email_action", label: "Show Email Action", desc: "Display the Email button." },
    { name: "show_website_action", label: "Show Website Action", desc: "Display the Website button." },
  ];

  return (
    <SettingsSection 
      title="Contact Actions" 
      description="Control the visual actions on Business Digital Cards. Disabling an action only hides it and does not delete business data."
    >
      <div className="space-y-4">
        {actions.map((action) => (
          <FormField
            key={action.name}
            control={form.control}
            name={action.name as "show_call_action" | "show_whatsapp_action" | "show_email_action" | "show_website_action"}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="space-y-0.5 pr-4">
                  <FormLabel className="text-base font-medium text-slate-900">{action.label}</FormLabel>
                  <FormDescription className="text-slate-500">
                    {action.desc}
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
        ))}
      </div>
    </SettingsSection>
  );
}
