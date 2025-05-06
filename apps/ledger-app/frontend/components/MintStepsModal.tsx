import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type MintStep = {
  id: string;
  label: string;
  status: "pending" | "in-progress" | "completed" | "error";
  errorMessage?: string;
};

type MintStepsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  steps: MintStep[];
  currentStepId: string;
};

// Helper function to determine the status message based on steps
const getStatusMessage = (steps: MintStep[]): string => {
  // Check if any step has an error
  const hasError = steps.some((step) => step.status === "error");
  if (hasError) {
    return "There was an error during the minting process. Please try again later.";
  }

  // Check if all steps are completed
  const allCompleted = steps.every((step) => step.status === "completed");
  if (allCompleted) {
    return "All steps completed successfully!";
  }

  // Default message for in-progress state
  return "Please wait while we process your mint...";
};

// Helper function to check if the modal can be closed
const canCloseModal = (steps: MintStep[]): boolean => {
  const hasError = steps.some((step) => step.status === "error");
  const allCompleted = steps.every((step) => step.status === "completed");
  return hasError || allCompleted;
};

export const MintStepsModal = ({ isOpen, onClose, steps, currentStepId }: MintStepsModalProps) => {
  const closable = canCloseModal(steps);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only allow closing if there's an error or all steps are completed
        if (!open && closable) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Minting Your Page</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col space-y-6">
            {steps.map((step, index) => {
              const isActive = step.id === currentStepId;
              const isCompleted = step.status === "completed";
              const isError = step.status === "error";
              const isInProgress = step.status === "in-progress";

              // Determine if we should show the connector line (not for the last item)
              const showConnector = index < steps.length - 1;

              return (
                <div key={step.id} className="relative">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : isError ? (
                        <Circle className="h-6 w-6 text-red-500" />
                      ) : isInProgress ? (
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-medium",
                          isActive && "text-blue-600",
                          isCompleted && "text-green-600",
                          isError && "text-red-600",
                        )}
                      >
                        {step.label}
                      </span>
                      {isError && step.errorMessage && (
                        <span className="text-sm text-red-500">{step.errorMessage}</span>
                      )}
                    </div>
                  </div>

                  {/* Connector line between steps */}
                  {showConnector && (
                    <div
                      className={cn(
                        "absolute left-3 ml-[0.1rem] w-0.5 bg-gray-300 -bottom-6 top-6",
                        isCompleted && "bg-green-500",
                        isInProgress && "bg-gradient-to-b from-blue-500 to-gray-300",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mb-4">{getStatusMessage(steps)}</div>

        {closable && (
          <div className="flex justify-center">
            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
