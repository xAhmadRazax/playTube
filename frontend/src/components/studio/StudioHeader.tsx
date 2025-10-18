import { Link, useNavigate } from '@tanstack/react-router';
import { Search, User } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useAuthStore } from '@/store/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettingStore } from '@/store/useSettings';

export const StudioHeader = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { settings, isLoading } = useSettingStore();
  return (
    <header className="bg-zinc-800 fixed top-0 w-full z-40 shadow shadow-slate-500 ">
      <div className="mx-auto max-w-screen-2xl lg:px-8 md:px-6 px-4 py-2 grid grid-cols-2 sm:grid-cols-3 gap-2   justify-between items-center">
        <Link className="flex items-center" to="/">
          <span
            className="h-14 place-self-start rounded-full outline-0 hover:scale-105 active:ring-2 active:ring-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-500 transition-all duration-100"
            dangerouslySetInnerHTML={{ __html: settings?.siteLogoSVG }}
          ></span>
          <span className="text-xl font-bold">Studio</span>
        </Link>
        <div className="hidden sm:flex bg-zinc-700 rounded-3xl  items-center justify-center place-self-center ">
          <input
            type="search"
            name=""
            id="search-bar"
            className="h-8 rounded-l-3xl ps-3 w-32 md:w-64 block outline-0 border border-transparent focus-visible:border-zinc-500 focus-visible:border-r-transparent pb-0.5 "
            placeholder="Search"
          />
          <label
            htmlFor="Search-bar"
            className="px-3 h-8 border-l-2 group border-zinc-500 flex items-center cursor-pointer "
          >
            <Search className="text-zinc-100 group-hover:text-zinc-200 " />
          </label>
        </div>

        {/* LOGIN AND SIGNUP LINKS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="ml-auto h-8 w-8 cursor-pointer rounded-full text-start flex justify-start p-0 "
              variant="default"
            >
              <span>
                {user && user.avatar ? (
                  <img
                    src={user.avatar}
                    width={32}
                    height={32}
                    className="rounded-full object-cover w-8 h-8"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    focusable="false"
                    aria-hidden="true"
                    className="pointer-none w-5 h-5  stroke-zinc-200 "
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1c4.96 0 9 4.04 9 9 0 1.42-.34 2.76-.93 3.96-1.53-1.72-3.98-2.89-7.38-3.03A3.996 3.996 0 0016 9c0-2.21-1.79-4-4-4S8 6.79 8 9c0 1.97 1.43 3.6 3.31 3.93-3.4.14-5.85 1.31-7.38 3.03C3.34 14.76 3 13.42 3 12c0-4.96 4.04-9 9-9zM9 9c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm3 12c-3.16 0-5.94-1.64-7.55-4.12C6.01 14.93 8.61 13.9 12 13.9c3.39 0 5.99 1.03 7.55 2.98C17.94 19.36 15.16 21 12 21z"></path>
                  </svg>
                )}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-auto  mt-3 bg-zinc-800 text-zinc-100 border-zinc-400 me-5"
            align="start"
          >
            <DropdownMenuGroup className="flex flex-col justify-center items-center ">
              <DropdownMenuItem
                className="w-full cursor-pointer"
                onClick={() => {
                  navigate({
                    to: '/profile/$username',
                    params: { username: user.username },
                    search: { contentType: 'videos' },
                  });
                }}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="w-full cursor-pointer"
                onClick={() => {
                  navigate({
                    to: '/studio/my-channel',
                  });
                }}
              >
                Studio
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* MOBILE OPTIONS BUTTON */}
        <div className="flex items-center  gap-4 sm:hidden justify-end">
          <button
            type="button"
            className=" sm:hidden outline-0 transition-all duration-100  w-8 h-8 rounded-full flex justify-center items-center hover:ring-2  active:ring-zinc-200 active:ring-2 hover:ring-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-200"
            aria-label="toggle-search"
          >
            <Search className="text-zinc-100 transition-colors duration-300 hover:text-zinc-200 pointer-none:" />
          </button>
        </div>
      </div>
    </header>
  );
};
