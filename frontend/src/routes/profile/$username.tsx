import { Link, createFileRoute, useSearch } from '@tanstack/react-router';
import type { ContentType } from '@/types/content.type';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileVideos } from '@/components/profile/profileContent/ProfileVideos';
import { ProfileTweets } from '@/components/profile/profileContent/ProfileTweets';
import { ProfilePlaylist } from '@/components/profile/profileContent/ProfilePlaylist';
import { ProfileShortVideos } from '@/components/profile/profileContent/ProfileShortsVideos';

export const Route = createFileRoute('/profile/$username')({
  validateSearch: (search) => {
    return {
      contentType: (search.contentType as ContentType | undefined) ?? 'videos',
      // sort: (search.sort as 'newest' | 'popular' | undefined) ?? 'newest',
      // page: Number(search.page) || 1,
    };
  },
  component: RouteComponent,
  loader: (data) => {
    console.log(data);
  },
});

function RouteComponent() {
  const search = useSearch({ from: '/profile/$username' });
  return (
    <section className="grid  bg-zinc-900 ">
      {/* <div className="bg-red-100"></div> */}
      <ProfileHeader />
      {/* content type */}

      {search.contentType === 'videos' && <ProfileVideos />}
      {search.contentType === 'shorts' && <ProfileShortVideos />}
      {search.contentType === 'tweets' && <ProfileTweets />}
      {search.contentType === 'playlists' && <ProfilePlaylist />}
    </section>
  );
}
