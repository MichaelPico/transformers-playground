import { Outlet } from 'react-router';
import { DashboardLayout, type DashboardLayoutSlots } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Layout() {
  const slots: DashboardLayoutSlots = {
    toolbarActions: () => (
      <>
        <LanguageSwitcher />
        {/* Default toolbar actions will be rendered here */}
      </>
    )
  };

  return (
    <DashboardLayout slots={slots}>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}