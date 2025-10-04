import { useState } from "react";
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
import { CreateTeamRequest } from "@/interfaces/ITeam";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTeamRequest) => void;
  isLoading?: boolean;
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateTeamModalProps) {
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: "",
    description: "",
    max_members: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CreateTeamRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      max_members: 5,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo nhóm mới</DialogTitle>
          <DialogDescription>
            Tạo nhóm mới để tham gia các cuộc thi và kết nối với các thành viên khác
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="teamName">Tên nhóm *</Label>
            <Input
              id="teamName"
              placeholder="VD: CodeMasters, Design Innovators..."
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Mô tả nhóm *</Label>
            <Textarea
              id="description"
              placeholder="Mô tả về nhóm, mục tiêu, kinh nghiệm..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="maxMembers">Số thành viên tối đa</Label>
            <Input
              id="maxMembers"
              type="number"
              min="2"
              max="10"
              value={formData.max_members}
              onChange={(e) => handleInputChange('max_members', parseInt(e.target.value))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo nhóm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
