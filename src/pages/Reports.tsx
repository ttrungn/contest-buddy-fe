import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Reports() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <Construction className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-4">Tính năng đang được phát triển</h1>
              <p className="text-muted-foreground">
                Chúng tôi đang phát triển tính năng này. Vui lòng quay lại sau.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
