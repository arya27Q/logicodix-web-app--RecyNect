import { RecoveryUnavailable } from '@/components/auth/RecoveryUnavailable';

export default function AdminForgotPasswordPage() {
  return <RecoveryUnavailable loginHref="/admin/login" />;
}
