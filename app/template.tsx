import { HomeIcon, Navigation, ProfileIcon } from '@/components/layout';

async function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black overflow-scroll">
      <div className="fixed w-full py-3 px-1 sm:px-3 flex justify-between items-center bg-black/80">
        <HomeIcon />
      </div>
      {children}
    </div>
  );
}

export default Template;
