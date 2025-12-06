import UpdatePage from '@/app/admin/update/UpdatePage';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/auth/verifyToken';
import { redirect } from 'next/navigation';

export default async function Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('admin_session')?.value;
  const { valid } = verifyToken(cookie);
  if (!valid) {
    redirect('/admin');
  }
  return <UpdatePage />;
}
