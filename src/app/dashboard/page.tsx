import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect to home if no session
    if (!session) {
        return redirect('/');
    }

    const user = session.user;

    // Redirect based on role only at `/dashboard`
    if (!user || !user.role) {
        return redirect('/');
    }

    // Redirect to specific dashboards based on role
    if (user.role === 'user') {
        return redirect('/dashboard/user');
    }

    if (user.role === 'admin') {
        return redirect('/dashboard/admin');
    }

    // Fallback for unknown roles
    return redirect('/');
}
