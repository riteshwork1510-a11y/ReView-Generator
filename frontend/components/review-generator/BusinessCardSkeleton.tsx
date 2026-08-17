import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BusinessCardSkeleton() {
  return (
    <Card className="flex flex-col h-full border-slate-200 shadow-sm animate-pulse">
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t border-slate-100 flex justify-between gap-2">
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
      <CardFooter className="pb-4 pt-0 flex justify-between gap-2">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
