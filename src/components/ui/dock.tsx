
'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};
type DockItemProps = {
  className?: string;
  children: React.ReactNode;
};
type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};
type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DocContextType = {
  mouseX: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};
type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within an DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.2, stiffness: 180, damping: 20 }, // Adjusted spring for smoother animation
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  // Debounce the mouse leave to prevent flickering
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isMouseOver) {
      timeout = setTimeout(() => {
        mouseX.set(Infinity);
        isHovered.set(0);
      }, 100);
    }
    return () => clearTimeout(timeout);
  }, [isMouseOver, mouseX, isHovered]);

  return (
    <motion.div
      style={{
        height: height,
        scrollbarWidth: 'none',
      }}
      className='mx-2 flex max-w-full items-end overflow-x-auto'
    >
      <motion.div
        onMouseMove={({ clientX, currentTarget }) => {
          // Using clientX and getBoundingClientRect for more accurate positioning
          const rect = currentTarget.getBoundingClientRect();
          const relativeX = clientX - rect.left;
          isHovered.set(1);
          mouseX.set(relativeX);
          setIsMouseOver(true);
        }}
        onMouseEnter={() => {
          setIsMouseOver(true);
        }}
        onMouseLeave={() => {
          setIsMouseOver(false);
        }}
        className={cn(
          'mx-auto flex w-fit gap-4 rounded-2xl bg-gray-50/90 px-4 backdrop-blur-sm dark:bg-neutral-900/90',
          className
        )}
        style={{ height: panelHeight }}
        role='toolbar'
        aria-label='Application dock'
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHovered = useMotionValue(0);
  const [isItemHovered, setIsItemHovered] = useState(false);

  // Calculate mouse distance with improved accuracy
  const mouseDistance = useTransform(mouseX, (val) => {
    if (!ref.current) return distance; // Return large value when not rendered
    const domRect = ref.current.getBoundingClientRect();
    const itemCenter = domRect.left + domRect.width / 2;
    // Calculate distance from window left plus the mouse position
    return val - (itemCenter - domRect.left);
  });

  // Apply smoother width transform
  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40],
    {
      clamp: false // Allow smoother transitions
    }
  );

  // Apply smoother spring for width animation
  const width = useSpring(widthTransform, {
    ...spring,
    stiffness: spring.stiffness * 1.2, // Slightly stiffer for item width
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onHoverStart={() => {
        isHovered.set(1);
        setIsItemHovered(true);
      }}
      onHoverEnd={() => {
        isHovered.set(0);
        setIsItemHovered(false);
      }}
      onFocus={() => {
        isHovered.set(1);
        setIsItemHovered(true);
      }}
      onBlur={() => {
        isHovered.set(0);
        setIsItemHovered(false);
      }}
      className={cn(
        'relative inline-flex items-center justify-center transition-all',
        isItemHovered ? 'z-10' : 'z-0',
        className
      )}
      tabIndex={0}
      role='button'
      aria-haspopup='true'
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement, { width, isHovered })
      )}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps['isHovered'] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white shadow-sm',
            className
          )}
          role='tooltip'
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const width = restProps['width'] as MotionValue<number>;

  // Slightly modified transform calculation for better proportions
  const widthTransform = useTransform(width, (val) => Math.max(val / 2, 20));

  return (
    <motion.div
      style={{ width: widthTransform }}
      className={cn('flex items-center justify-center', className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
