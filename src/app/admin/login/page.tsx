import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  redirect("/?auth=signin&returnUrl=/admin/products");
}
