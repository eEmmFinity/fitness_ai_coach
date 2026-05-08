// Single source of truth for "where does this role's home page live?"
// Used by login/register/dashboard redirects so we don't drift across pages.

export type AppRole = 'user' | 'pending_coach' | 'coach' | 'admin';

export function homeFor(role: AppRole | undefined | null): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'coach':
      return '/coach';
    // pending_coach + user share the trainee dashboard until approved
    default:
      return '/dashboard';
  }
}
