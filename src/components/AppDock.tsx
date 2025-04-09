
import { Activity, Component, HomeIcon, Package } from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';

const dockItems = [
  {
    title: 'Home',
    icon: (
      <HomeIcon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Products',
    icon: (
      <Package className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Components',
    icon: (
      <Component className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Activity',
    icon: (
      <Activity className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
];

export function AppDock() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl">
        <Dock className='items-end pb-2' panelHeight={48} magnification={64} distance={120}>
          {dockItems.map((item, idx) => (
            <DockItem
              key={idx}
              className='aspect-square rounded-full bg-card shadow-sm border border-border/50'
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>
    </div>
  );
}
