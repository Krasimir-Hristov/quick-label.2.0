import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string;
}

export function FeatureCard({
  title,
  description,
  href,
  icon: Icon,
  isActive = true,
  badge,
}: FeatureCardProps) {
  return (
    <div className='border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-all hover:scale-105 duration-200'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-3 rounded-lg ${
              isActive ? 'bg-[#a8c706]/20' : 'bg-gray-100'
            }`}
          >
            <Icon
              className={`w-6 h-6 ${
                isActive ? 'text-[#a8c706]' : 'text-gray-400'
              }`}
            />
          </div>
          <h2 className='text-xl font-semibold text-black'>{title}</h2>
        </div>
        {badge && (
          <span className='px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full'>
            {badge}
          </span>
        )}
      </div>
      <p className='text-gray-600 mb-4 min-h-[4rem]'>{description}</p>
      <Button
        asChild
        disabled={!isActive}
        className='w-full bg-black text-[#a8c706] hover:bg-white hover:text-black'
      >
        <Link href={href}>{isActive ? 'Öffnen' : 'Bald'}</Link>
      </Button>
    </div>
  );
}
