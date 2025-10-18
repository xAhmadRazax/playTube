import { useParams, useSearch } from '@tanstack/react-router';
import type { ContentType } from '@/types/content.type';
import { Tab } from '@/components/profile/Tab';

export const Tabs = () => {
  const { username } = useParams({ from: '/profile/$username' });

  const search = useSearch({ from: '/profile/$username' });
  const tabs = [
    { id: 'videos', label: 'Videos', count: 45 },
    { id: 'shorts', label: 'Shorts', count: 23 },
    { id: 'tweets', label: 'Tweets', count: 156 },
    { id: 'playlists', label: 'Playlists', count: 8 },
  ];

  return (
    <ul className="flex just mt-6  border-t-2 border-zinc-700">
      {tabs.map((tab) => (
        <Tab
          id={tab.id}
          contentType={tab.id}
          username={username}
          active={search.contentType}
        >
          {tab.label}
        </Tab>
      ))}
    </ul>
  );
};
