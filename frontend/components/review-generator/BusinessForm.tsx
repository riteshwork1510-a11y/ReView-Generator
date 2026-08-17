import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Business, BusinessCreateInput } from "@/types/business";
import { ServicesCombobox } from "./ServicesCombobox";
import { Check, Building2, UserCircle, PhoneCall, Globe, ChevronRight, ChevronLeft, X } from "lucide-react";

const businessSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(100, "Too long"),
  services_products: z.string().trim().min(1, "Services/Products are required").max(500, "Too long"),
  google_review_url: z.string().trim().url("Must be a valid URL").min(1, "Google Review URL is required").refine(val => val.startsWith("https://"), { message: "Must use HTTPS" }),
  call_number: z.string().trim().optional(),
  whatsapp_number: z.string().trim().optional(),
  contact_number: z.string().trim().optional(),
  website: z.union([z.literal(""), z.string().trim().url("Must be a valid URL")]).optional(),
  location: z.string().trim().optional(),
  address: z.string().trim().optional(),
  email: z.union([z.literal(""), z.string().trim().email("Must be a valid email")]).optional(),
  image_url: z.union([z.literal(""), z.string().trim()]).optional(),
  owner_name: z.string().trim().optional(),
  owner_role: z.string().trim().optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

interface BusinessFormProps {
  initialData?: Business | null;
  onSubmit: (data: BusinessCreateInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const steps = [
  { id: 1, title: 'Business Info', description: 'Basic company details', icon: Building2, fields: ['company_name', 'services_products', 'address', 'location'] },
  { id: 2, title: 'Owner Info', description: 'Who runs this?', icon: UserCircle, fields: ['owner_name', 'owner_role'] },
  { id: 3, title: 'Contact Info', description: 'Ways to reach you', icon: PhoneCall, fields: ['call_number', 'whatsapp_number', 'contact_number', 'email'] },
  { id: 4, title: 'Online Presence', description: 'Website & Social', icon: Globe, fields: ['website', 'google_review_url', 'image_url'] }
];

export function BusinessForm({ initialData, onSubmit, onCancel, isSubmitting }: BusinessFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      company_name: initialData?.company_name || "",
      services_products: initialData?.services_products || "",
      google_review_url: initialData?.google_review_url || "",
      call_number: initialData?.call_number || "",
      whatsapp_number: initialData?.whatsapp_number || "",
      contact_number: initialData?.contact_number || "",
      website: initialData?.website || "",
      location: initialData?.location || "",
      address: initialData?.address || "",
      email: initialData?.email || "",
      image_url: initialData?.image_url || "",
      owner_name: initialData?.owner_name || "",
      owner_role: initialData?.owner_role || "",
    },
  });

  const handleNext = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = steps[currentStep - 1].fields as any[];
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (data: BusinessFormValues) => {
    const cleanedData = {
      ...data,
      website: data.website || undefined,
      email: data.email || undefined,
      image_url: data.image_url || undefined,
    };
    await onSubmit(cleanedData as BusinessCreateInput);
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[600px] h-full max-h-[90vh]">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-[280px] lg:w-[320px] bg-slate-50 p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 shrink-0 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          onClick={onCancel}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="mb-6 md:mb-10 pr-8 md:pr-0">
          <h2 className="text-2xl font-bold text-slate-900">{initialData ? "Edit Business" : "Add Business"}</h2>
          <p className="text-sm text-slate-500 mt-1.5">Complete the steps below.</p>
        </div>
        
        {/* Desktop Vertical Steps */}
        <div className="hidden md:flex flex-col gap-8 relative flex-1">
          {/* Track Line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 -z-10 rounded-full"></div>
          {/* Active Line */}
          <div 
             className="absolute left-6 top-6 w-0.5 bg-indigo-600 -z-10 transition-all duration-500 rounded-full"
             style={{ height: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 24px)` }}
          ></div>

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div 
                key={step.id} 
                className="flex items-start gap-4 relative cursor-pointer group"
                onClick={() => setCurrentStep(step.id)}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-2 shadow-sm
                    ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white group-hover:bg-indigo-700 group-hover:border-indigo-700' : 
                      isCurrent ? 'bg-white border-indigo-600 text-indigo-600 scale-110 shadow-md' : 
                      'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-400'}`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex flex-col mt-1">
                  <span className={`text-sm font-bold transition-colors duration-300 ${isCurrent ? 'text-indigo-900' : isCompleted ? 'text-slate-900 group-hover:text-indigo-700' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                    {step.title}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{step.description}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Mobile Horizontal Summary */}
        <div className="md:hidden flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
            {currentStep}<span className="text-sm opacity-60">/{steps.length}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{steps[currentStep-1].title}</p>
            <p className="text-xs text-slate-500">{steps[currentStep-1].description}</p>
          </div>
        </div>
      </div>

      {/* Form Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 hidden md:flex text-slate-400 hover:text-slate-600 hover:bg-slate-100 z-10"
          onClick={onCancel}
        >
          <X className="w-5 h-5" />
        </Button>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-8 md:pt-16">
            <div className="max-w-2xl mx-auto w-full">
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Business Details</h3>
                    <p className="text-slate-500 mt-1">What is the core of your business?</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <Label htmlFor="company_name" className="text-slate-900 font-semibold">Company Name <span className="text-red-500">*</span></Label>
                      <Input id="company_name" className="h-11" placeholder="e.g. Reliance Industries" {...form.register("company_name")} />
                      {form.formState.errors.company_name && (
                        <p className="text-sm text-red-500 font-medium">{form.formState.errors.company_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="services_products" className="text-slate-900 font-semibold">Services / Products <span className="text-red-500">*</span></Label>
                      <Controller
                        name="services_products"
                        control={form.control}
                        render={({ field }) => (
                          <ServicesCombobox
                            value={field.value}
                            onChange={field.onChange}
                            error={form.formState.errors.services_products?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="address" className="text-slate-700 font-medium">Full Address</Label>
                      <Textarea 
                        id="address" 
                        placeholder="e.g. 123 CG Road, Navrangpura, Ahmedabad 380009" 
                        className="resize-none min-h-[100px]"
                        {...form.register("address")} 
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="location" className="text-slate-700 font-medium">Location (City, State)</Label>
                      <Input id="location" className="h-11" placeholder="e.g. Ahmedabad, Gujarat" {...form.register("location")} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Owner Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Owner Information</h3>
                    <p className="text-slate-500 mt-1">Who is the driving force behind this business?</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <Label htmlFor="owner_name" className="text-slate-700 font-medium">Owner Name</Label>
                      <Input id="owner_name" className="h-11" placeholder="e.g. Mukesh Ambani" {...form.register("owner_name")} />
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="owner_role" className="text-slate-700 font-medium">Owner Role</Label>
                      <Input id="owner_role" className="h-11" placeholder="e.g. CEO / Founder" {...form.register("owner_role")} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Contact Details</h3>
                    <p className="text-slate-500 mt-1">How can customers reach you directly?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2.5">
                      <Label htmlFor="call_number" className="text-slate-700 font-medium">Call Number</Label>
                      <Input id="call_number" className="h-11" type="tel" placeholder="+91 98765 43210" {...form.register("call_number")} />
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="whatsapp_number" className="text-slate-700 font-medium">WhatsApp Number</Label>
                      <Input id="whatsapp_number" className="h-11" type="tel" placeholder="+91 98765 43210" {...form.register("whatsapp_number")} />
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="contact_number" className="text-slate-700 font-medium">Alternative Contact</Label>
                      <Input id="contact_number" className="h-11" type="tel" placeholder="+91 98765 43210" {...form.register("contact_number")} />
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                      <Input id="email" className="h-11" type="email" placeholder="info@company.com" {...form.register("email")} />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500 font-medium">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Online Presence */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Online Presence</h3>
                    <p className="text-slate-500 mt-1">Where does your business live online?</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <Label htmlFor="google_review_url" className="text-slate-900 font-semibold">Google Review URL <span className="text-red-500">*</span></Label>
                      <Input id="google_review_url" className="h-11" type="url" placeholder="https://g.page/ahmedabad-cafe/review" {...form.register("google_review_url")} />
                      <p className="text-xs text-slate-500">Paste the direct Google review link to generate 5-star reviews.</p>
                      {form.formState.errors.google_review_url && (
                        <p className="text-sm text-red-500 font-medium">{form.formState.errors.google_review_url.message}</p>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="website" className="text-slate-700 font-medium">Website URL</Label>
                      <Input id="website" className="h-11" type="url" placeholder="https://www.company.com" {...form.register("website")} />
                      {form.formState.errors.website && (
                        <p className="text-sm text-red-500 font-medium">{form.formState.errors.website.message}</p>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="image_url" className="text-slate-700 font-medium">Logo / Image</Label>
                      <div className="flex gap-3">
                        <Input id="image_url" className="h-11 flex-1" type="text" placeholder="https://example.com/logo.png or upload" {...form.register("image_url")} />
                        <div className="relative overflow-hidden inline-block shrink-0">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  form.setValue("image_url", reader.result as string, { shouldValidate: true, shouldDirty: true });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <Button type="button" variant="outline" className="h-11 px-4 border-slate-200">
                            Upload File
                          </Button>
                        </div>
                      </div>
                      {form.formState.errors.image_url && (
                        <p className="text-sm text-red-500 font-medium">{form.formState.errors.image_url.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="px-6 py-5 md:px-10 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={currentStep === 1 ? onCancel : handlePrevious} 
              disabled={isSubmitting}
              className="h-11 px-5 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            >
              {currentStep === 1 ? "Cancel" : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-1.5" />
                  Back
                </>
              )}
            </Button>

            {currentStep < steps.length ? (
              <Button 
                type="button" 
                onClick={handleNext} 
                className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Complete & Add"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
