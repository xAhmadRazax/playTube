import React from 'react';
import { Check, UserRoundPlus } from 'lucide-react';
import { Tabs } from './Tabs';
import { Button } from '@/components/Button';

export const ProfileHeader = () => {
  return (
    <header className="">
      <div className="flex flex-col  items-center ">
        {/* profile cover */}
        <div className="flex  flex-col   w-full" aria-label="Cover photo">
          <div className="bg-teal-300 h-56 w-full"></div>
        </div>

        <div className="flex w-full flex-col md:flex-row">
          {/* profile  */}
          <div className="flex grow  gap-5 ">
            {/* user profile pic */}
            <figure className="ms-6" aria-label="Profile picture">
              <div className=" h-32 w-32 bg-violet-400 rounded-full -mt-8 ring ring-violet-200"></div>
            </figure>
            {/* user basic info */}
            <hgroup className="flex flex-col grow pt-5">
              {/* username + verification */}
              <div className="flex items-center gap-2 ">
                <h2 className="text-lg lg:text-xl  font-semibold ">Username</h2>
                <span className="flex items-center justify-center bg-violet-400 rounded-full p-0.5">
                  <Check className="w-3 h-3 stroke-3 text-violet-950" />
                </span>
              </div>
              {/* handle */}
              <p className="text-sm text-zinc-400">@reactpatterns</p>
              {/* channel stats */}
              <p className="text-sm text-zinc-400 flex gap-2">
                <span className="flex gap-1 capitalize">
                  <span>195k</span>
                  <span>subscriber</span>
                </span>
                <span>•</span>
                <span className="flex gap-1 capitalize">
                  <span>304</span>
                  <span>videos</span>
                </span>
              </p>
            </hgroup>
          </div>

          {/* sub button */}
          <div className="px-6   pt-5">
            <Button classes="flex gap-2">
              <span>
                <UserRoundPlus />
              </span>
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <Tabs />
    </header>
  );
};
