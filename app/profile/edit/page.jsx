import { redirect } from "next/navigation";

// The edit form was merged into the main profile page.
export default function EditProfileRedirect() {
  redirect("/profile");
}
