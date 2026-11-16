// components/ui/ConfirmDialog.tsx
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui";
import { Button } from "@/components/ui";

interface ConfirmDialogProps {
	open: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	title?: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	isLoading?: boolean;
}

export default function ConfirmDialog({
	open,
	onConfirm,
	onCancel,
	title = "Are you sure?",
	description = "",
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	isLoading = false, // ← NEW
}: ConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onCancel}>
			<DialogContent className="max-w-sm">
				<DialogTitle>{title}</DialogTitle>

				{description && (
					<DialogDescription className="mb-4 text-sm text-gray-600">
						{description}
					</DialogDescription>
				)}

				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onCancel} disabled={isLoading}>
						{cancelLabel}
					</Button>

					<Button onClick={onConfirm} disabled={isLoading}>
						{isLoading ? "Please wait\u2026" : confirmLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
