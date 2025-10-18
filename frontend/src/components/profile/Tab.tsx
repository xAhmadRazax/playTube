import { Link } from '@tanstack/react-router';
import type { ContentType } from '@/types/content.type';
import type { ReactNode } from 'react';

export const Tab = ({
  username,
  contentType,
  id,
  children,
  active,
}: {
  id: string;
  username: string;
  contentType: string;
  children: ReactNode;
  active?: ContentType;
}) => {
  return (
    <li key={id} className="">
      <Link
        className={`px-2 py-2  md:px-4 border-b-4 inline-block border-b-transparent ${active === id ? 'bg-violet-50 text-violet-950 border-b-violet-400' : 'text-violet-50'}`}
        to="/profile/$username"
        params={{ username: username }}
        search={{ contentType: contentType as ContentType }}
      >
        {children}
      </Link>
    </li>
  );
};
