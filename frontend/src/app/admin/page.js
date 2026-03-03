import { redirect } from 'next/navigation';

export default function AdminBasePage() {
  // Automatically route users to the first tab
  redirect('/admin/matches');
}