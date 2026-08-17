"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getSettings, updateSettings } from "@/lib/api/settings";

import { GeneralSettings, generalSettingsSchema } from "@/components/settings/GeneralSettings";
import { ReviewSettings, reviewSettingsSchema } from "@/components/settings/ReviewSettings";
import { ContactActionSettings, contactActionSettingsSchema } from "@/components/settings/ContactActionSettings";
import { SettingsSkeleton } from "@/components/settings/SettingsSkeleton";

const formSchema = generalSettingsSchema.merge(reviewSettingsSchema).merge(contactActionSettingsSchema);

type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      application_name: "",
      review_cta_text: "",
      show_google_review_button: true,
      show_call_action: true,
      show_whatsapp_action: true,
      show_email_action: true,
      show_website_action: true,
    },
  });

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getSettings();
      if (response.success && response.data) {
        form.reset({
          application_name: response.data.application_name,
          review_cta_text: response.data.review_cta_text,
          show_google_review_button: response.data.show_google_review_button,
          show_call_action: response.data.show_call_action,
          show_whatsapp_action: response.data.show_whatsapp_action,
          show_email_action: response.data.show_email_action,
          show_website_action: response.data.show_website_action,
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, [loadSettings]);

  const onSubmit = async (data: FormValues) => {
    try {
      setSaving(true);
      const response = await updateSettings(data);
      if (response.success) {
        toast.add({
          type: "success",
          title: "Settings saved successfully.",
          description: "Your application settings have been updated.",
        });
        // Update local state, though form already has the values
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.add({
        type: "error",
        title: "Unable to save settings.",
        description: "An error occurred while saving. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Configure application preferences.</p>
        </div>
      </div>

      {loading ? (
        <SettingsSkeleton />
      ) : error ? (
        <div className="p-12 text-center border-2 border-dashed border-red-100 rounded-xl bg-red-50/50 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Failed to load</h3>
          <p className="text-slate-500 mb-6">There was a network or server error.</p>
          <Button variant="outline" onClick={loadSettings} className="bg-white">
            Retry
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <GeneralSettings form={form} />
            <ReviewSettings form={form} />
            <ContactActionSettings form={form} />
            
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
