import React from 'react';

export const ProfileShortVideos = () => {
  return (
    <section className="min-h-screen p-8  border-t-2 border-zinc-800 flex flex-col items-center">
      <p className="mb-3">
        <span className="inline-flex rounded-full bg-violet-200 p-2 text-violet-500">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 stroke-violet-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            ></path>
          </svg>
        </span>
      </p>
      <h5 className="mb-2 font-semibold">No shorts uploaded</h5>
      <p>This page has yet to upload a short video.</p>
    </section>
  );
};
