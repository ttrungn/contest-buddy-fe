import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

type FeedbackLinkProps = {
  url?: string;
};

export default function FeedbackLink({
  url = "https://docs.google.com/forms/d/e/1FAIpQLSd5wWHBIBhM8nh5udAPokUXvd_I9TUBcik2le7kLPBSDaN8Dw/viewform?usp=header",
}: FeedbackLinkProps) {
  return (
    <div className="fixed bottom-20 right-4 z-50 group">
      <div className="relative">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Gửi phản hồi"
        >
          <Button
            className="h-14 w-14 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white"
            size="icon"
          >
            <MessageSquarePlus className="h-6 w-6" />
          </Button>
        </a>
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Feedback
        </div>
      </div>
    </div>
  );
}
