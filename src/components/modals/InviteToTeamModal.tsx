import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { getUserTeams, sendTeamInvitation } from "@/services/features/teams/teamsSlice";
import { useToast } from "@/hooks/use-toast";
import { Team } from "@/interfaces/ITeam";

interface InviteToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteeId: string;
  inviteeName: string;
}

export default function InviteToTeamModal({
  isOpen,
  onClose,
  inviteeId,
  inviteeName,
}: InviteToTeamModalProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { teams, isLoading } = useAppSelector((state) => state.teams);
  
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user teams when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getUserTeams());
    }
  }, [isOpen, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeamId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nhóm để mời",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(sendTeamInvitation({
        teamId: selectedTeamId,
        inviteeId,
        message: message || "Xin chào! Tôi muốn mời bạn tham gia nhóm của chúng tôi."
      })).unwrap();

      toast({
        title: "Thành công",
        description: `Đã gửi lời mời tham gia nhóm cho ${inviteeName}`,
      });

      onClose();
      setSelectedTeamId("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi lời mời tham gia nhóm",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedTeamId("");
    setMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mời vào nhóm</DialogTitle>
          <DialogDescription>
            Mời <strong>{inviteeName}</strong> tham gia nhóm của bạn
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="team">Chọn nhóm</Label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm để mời" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Lời nhắn (tùy chọn)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xin chào! Tôi muốn mời bạn tham gia nhóm của chúng tôi..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedTeamId}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi lời mời"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
