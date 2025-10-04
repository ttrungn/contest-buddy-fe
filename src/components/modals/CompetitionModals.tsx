import { useState } from "react";
import CreateCompetitionModal from "@/components/modals/CreateCompetitionModal";
import UpdateCompetitionModal from "@/components/modals/UpdateCompetitionModal";
import DeleteCompetitionModal from "@/components/modals/DeleteCompetitionModal";
import { CompetitionDetail } from "@/interfaces/ICompetition";

interface CompetitionModalsProps {
  // Create Modal
  isCreateModalOpen: boolean;
  onCreateModalClose: () => void;
  onCreateSuccess?: (competition: any) => void;

  // Update Modal
  isUpdateModalOpen: boolean;
  onUpdateModalClose: () => void;
  competitionToUpdate: CompetitionDetail | null;
  onUpdateSuccess?: (competition: CompetitionDetail) => void;

  // Delete Modal
  isDeleteModalOpen: boolean;
  onDeleteModalClose: () => void;
  onDeleteConfirm: () => void;
  competitionToDelete: any;
  isDeleting?: boolean;
}

export default function CompetitionModals({
  isCreateModalOpen,
  onCreateModalClose,
  onCreateSuccess,
  isUpdateModalOpen,
  onUpdateModalClose,
  competitionToUpdate,
  onUpdateSuccess,
  isDeleteModalOpen,
  onDeleteModalClose,
  onDeleteConfirm,
  competitionToDelete,
  isDeleting = false,
}: CompetitionModalsProps) {
  return (
    <>
      {/* Create Competition Modal */}
      <CreateCompetitionModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        onSuccess={onCreateSuccess}
      />

      {/* Update Competition Modal */}
      <UpdateCompetitionModal
        isOpen={isUpdateModalOpen}
        onClose={onUpdateModalClose}
        competition={competitionToUpdate}
        onSuccess={onUpdateSuccess}
      />

      {/* Delete Competition Modal */}
      <DeleteCompetitionModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={onDeleteConfirm}
        competitionTitle={competitionToDelete?.competition?.title}
        isLoading={isDeleting}
      />
    </>
  );
}
