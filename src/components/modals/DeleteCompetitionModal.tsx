import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  competitionTitle?: string;
  isLoading?: boolean;
}

export default function DeleteCompetitionModal({
  isOpen,
  onClose,
  onConfirm,
  competitionTitle,
  isLoading = false,
}: DeleteCompetitionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa cuộc thi</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa cuộc thi "{competitionTitle}"? 
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
