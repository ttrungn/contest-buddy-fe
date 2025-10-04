import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TeamMember } from "@/interfaces/ITeam";

interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  member: TeamMember | null;
  isLoading?: boolean;
}

export default function RemoveMemberModal({
  isOpen,
  onClose,
  onConfirm,
  member,
  isLoading = false,
}: RemoveMemberModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md"
        aria-hidden={false}
        data-aria-hidden={false}
      >
        <DialogHeader>
          <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
          <DialogDescription>
            Hành động này sẽ xóa thành viên khỏi nhóm và không thể hoàn tác
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa <strong>{member?.user.full_name}</strong> khỏi nhóm?
            Hành động này không thể hoàn tác.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xóa..." : "Xóa thành viên"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
