import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UpdateTeamRequest, Team } from "@/interfaces/ITeam";

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateTeamRequest) => void;
  team: Team | null;
  isLoading?: boolean;
}

export default function EditTeamModal({
  isOpen,
  onClose,
  onSubmit,
  team,
  isLoading = false,
}: EditTeamModalProps) {
  const [formData, setFormData] = useState<UpdateTeamRequest>({
    name: "",
    description: "",
    max_members: 5,
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description,
        max_members: team.max_members,
      });
    }
  }, [team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof UpdateTeamRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nhóm</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin nhóm của bạn
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="editTeamName">Tên nhóm *</Label>
            <Input
              id="editTeamName"
              placeholder="VD: CodeMasters, Design Innovators..."
              value={formData.name || ""}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="editDescription">Mô tả nhóm *</Label>
            <Textarea
              id="editDescription"
              placeholder="Mô tả về nhóm, mục tiêu, kinh nghiệm..."
              value={formData.description || ""}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật nhóm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
