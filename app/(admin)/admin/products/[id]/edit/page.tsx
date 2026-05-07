import { AddProductWizard } from "@/components/admin/add-product/AddProductWizard";

export default function EditAdminProductPage({ params }: { params: { id: string } }) {
  return <AddProductWizard mode="edit" productId={params.id} />;
}
