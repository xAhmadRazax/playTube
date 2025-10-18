import { createFileRoute } from '@tanstack/react-router';
import {
  BarChart3Icon,
  ListVideoIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  PlayIcon,
  PlaySquareIcon,
  SettingsIcon,
  UploadIcon,
  VideoIcon,
} from 'lucide-react';
import { StudioHeader } from '@/components/studio/StudioHeader';

export const Route = createFileRoute('/studio/my-channel')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      ( <StudioHeader />
      <div className="flex h-screen bg-zinc-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-800 border-r border-zinc-700">
          <div className="p-4 border-b border-zinc-700">
            <h1 className="text-xl font-bold">Studio</h1>
          </div>

          <nav className="p-2">
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm font-medium text-zinc-400">
                CONTENT
              </div>
              <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg bg-zinc-700 text-white">
                <VideoIcon className="w-4 h-4 mr-3" />
                Videos
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-750 text-zinc-300">
                <PlaySquareIcon className="w-4 h-4 mr-3" />
                Shorts
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-750 text-zinc-300">
                <ListVideoIcon className="w-4 h-4 mr-3" />
                Playlists
              </button>
            </div>

            <div className="mt-6 space-y-1">
              <div className="px-3 py-2 text-sm font-medium text-zinc-400">
                ANALYTICS
              </div>
              <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-750 text-zinc-300">
                <BarChart3Icon className="w-4 h-4 mr-3" />
                Analytics
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-750 text-zinc-300">
                <MessageSquareIcon className="w-4 h-4 mr-3" />
                Comments
              </button>
            </div>

            <div className="mt-6 space-y-1">
              <div className="px-3 py-2 text-sm font-medium text-zinc-400">
                CUSTOMIZATION
              </div>
              <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-750 text-zinc-300">
                <PaletteIcon className="w-4 h-4 mr-3" />
                Customization
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-750 text-zinc-300">
                <SettingsIcon className="w-4 h-4 mr-3" />
                Settings
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="border-b border-zinc-700 bg-zinc-800">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-2xl font-bold">Channel Content</h2>
                <p className="text-zinc-400 text-sm">
                  Manage your videos and shorts
                </p>
              </div>
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <UploadIcon className="w-4 h-4" />
                Upload
              </button>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-zinc-400 text-sm">Total Views</div>
              <div className="text-2xl font-bold mt-1">1.2M</div>
              <div className="text-green-400 text-sm mt-1">
                ↑ 12% from last month
              </div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-zinc-400 text-sm">Subscribers</div>
              <div className="text-2xl font-bold mt-1">45.2K</div>
              <div className="text-green-400 text-sm mt-1">↑ 124 this week</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-zinc-400 text-sm">Watch Time</div>
              <div className="text-2xl font-bold mt-1">12.4K hours</div>
              <div className="text-green-400 text-sm mt-1">
                ↑ 8% from last month
              </div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-zinc-400 text-sm">Videos</div>
              <div className="text-2xl font-bold mt-1">156</div>
              <div className="text-zinc-400 text-sm mt-1">3 drafts</div>
            </div>
          </div>

          {/* Videos Table */}
          <div className="p-6">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="p-4 border-b border-zinc-700">
                <h3 className="font-semibold">Recent Videos</h3>
              </div>

              <div className="divide-y divide-zinc-700">
                {/* Video 1 */}
                <div className="p-4 flex items-center gap-4 hover:bg-zinc-750">
                  <div className="w-32 h-18 bg-zinc-600 rounded relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 px-1 rounded text-xs">
                      10:24
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">
                      How to Build a YouTube Clone in 2024
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                      <span>12K views</span>
                      <span>•</span>
                      <span>2 days ago</span>
                      <span className="bg-zinc-700 px-2 py-0.5 rounded text-xs">
                        Public
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-zinc-700 rounded">
                      <MoreHorizontalIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Video 2 */}
                <div className="p-4 flex items-center gap-4 hover:bg-zinc-750">
                  <div className="w-32 h-18 bg-zinc-600 rounded relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 px-1 rounded text-xs">
                      15:42
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">
                      React State Management Tutorial
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                      <span>8.5K views</span>
                      <span>•</span>
                      <span>1 week ago</span>
                      <span className="bg-zinc-700 px-2 py-0.5 rounded text-xs">
                        Public
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-zinc-700 rounded">
                      <MoreHorizontalIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Video 3 */}
                <div className="p-4 flex items-center gap-4 hover:bg-zinc-750">
                  <div className="w-32 h-18 bg-zinc-600 rounded relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 px-1 rounded text-xs">
                      7:18
                    </div>
                    <div className="absolute top-1 left-1 bg-yellow-600 px-2 py-0.5 rounded text-xs">
                      Draft
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-zinc-400">
                      TypeScript Advanced Patterns
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                      <span>0 views</span>
                      <span>•</span>
                      <span>Saved 3 hours ago</span>
                      <span className="bg-zinc-700 px-2 py-0.5 rounded text-xs">
                        Private
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-zinc-700 rounded">
                      <MoreHorizontalIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      )
    </>
  );
}
