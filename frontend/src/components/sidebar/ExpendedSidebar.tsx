import React, { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { BrandControls } from '../navbar/BrandControls'
import { ExpendedSidebarItem } from './ExpendedSidebarItem'

import type { Dispatch, SetStateAction } from 'react'
import { useSettings } from '@/contexts/SettingsContent'

// const sidebarItems = [
//   {
//     logo: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="currentColor"
//         viewBox="0 0 24 24"
//         focusable="false"
//         aria-hidden="true"
//         className="pointer-events-none w-6 h-6"
//       >
//         <path
//           clip-rule="evenodd"
//           d="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5h-5v-7h-3v7h-5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146ZM18.5 9.621l-6.5-6.5-6.5 6.5V19.5H9V13a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6.5h3.5V9.621Z"
//           fill-rule="evenodd"
//         ></path>
//       </svg>
//     ),
//     content: 'Home',
//     to: '/register',
//     subCategories: [],
//   },
//   {
//     logo: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="currentColor"
//         viewBox="0 0 24 24"
//         focusable="false"
//         aria-hidden="true"
//         className="pointer-events-none w-6 h-6"
//       >
//         <path
//           clip-rule="evenodd"
//           d="m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z"
//           fill-rule="evenodd"
//         ></path>
//       </svg>
//     ),
//     content: 'Shorts',
//     to: '/',
//   },
//   {
//     logo: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="currentColor"
//         viewBox="0 0 24 24"
//         focusable="false"
//         aria-hidden="true"
//         className="pointer-events-none w-6 h-6"
//       >
//         <path
//           clip-rule="evenodd"
//           d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z"
//           fill-rule="evenodd"
//         ></path>
//       </svg>
//     ),
//     content: 'Subscription',
//     to: '/',
//     hasDivider: true,
//   },
//   {
//     logo: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="currentColor"
//         viewBox="0 0 24 24"
//         focusable="false"
//         aria-hidden="true"
//         className="pointer-events-none w-6 h-6"
//       >
//         <path
//           clip-rule="evenodd"
//           d="M12 20.5c1.894 0 3.643-.62 5.055-1.666a5.5 5.5 0 00-10.064-.105.755.755 0 01-.054.099A8.462 8.462 0 0012 20.5Zm4.079-5.189a7 7 0 012.142 2.48 8.5 8.5 0 10-12.443 0 7 7 0 0110.3-2.48ZM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm2-12.5a2 2 0 11-4 0 2 2 0 014 0Zm1.5 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z"
//           fill-rule="evenodd"
//         ></path>
//       </svg>
//     ),
//     content: 'You',
//     to: '/',
//   },
// ]
export interface ExpendedSidebarItemsType {
  logo: React.ReactElement
  content: string
  to: string
  hasDivider?: boolean
  isPublic?: boolean
  subCategories?: Array<ExpendedSidebarItemsType>
}

const sidebarItems: Array<ExpendedSidebarItemsType> = [
  {
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        focusable="false"
        aria-hidden="true"
        className="pointer-events-none w-6 h-6"
      >
        <path
          clip-rule="evenodd"
          d="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5h-5v-7h-3v7h-5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146ZM18.5 9.621l-6.5-6.5-6.5 6.5V19.5H9V13a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6.5h3.5V9.621Z"
          fill-rule="evenodd"
        ></path>
      </svg>
    ),
    content: 'Home',
    to: '/register',
    isPublic: true,
  },
  {
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        focusable="false"
        aria-hidden="true"
        className="pointer-events-none w-6 h-6"
      >
        <path
          clip-rule="evenodd"
          d="m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z"
          fill-rule="evenodd"
        ></path>
      </svg>
    ),
    content: 'Shorts',
    to: '/',
    isPublic: true,
  },
  {
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        focusable="false"
        aria-hidden="true"
        className="pointer-events-none w-6 h-6"
      >
        <path
          clip-rule="evenodd"
          d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z"
          fill-rule="evenodd"
        ></path>
      </svg>
    ),
    content: 'Subscription',
    to: '/',
    isPublic: true,
    hasDivider: true,
  },
  {
    content: 'You',
    to: '/',
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        focusable="false"
        aria-hidden="true"
        className="pointer-events-none w-6 h-6"
      >
        <path
          clip-rule="evenodd"
          d="M18.37 19.709A9.98 9.98 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.98 9.98 0 003.63 7.709A9.96 9.96 0 0012 22a9.96 9.96 0 006.37-2.291ZM6.15 18.167a6.499 6.499 0 0111.7 0A8.47 8.47 0 0112 20.5a8.47 8.47 0 01-5.85-2.333ZM15.5 9.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z"
          fill-rule="evenodd"
        ></path>
      </svg>
    ),
    isPublic: true,
    subCategories: [
      {
        content: 'History',
        to: '/',
        logo: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            focusable="false"
            aria-hidden="true"
            className="pointer-events-none w-6 h-6"
          >
            <path
              clip-rule="evenodd"
              d="M14.203 4.83c-1.74-.534-3.614-.418-5.274.327-1.354.608-2.49 1.6-3.273 2.843H8.25c.414 0 .75.336.75.75s-.336.75-.75.75H3V4.25c0-.414.336-.75.75-.75s.75.336.75.75v2.775c.935-1.41 2.254-2.536 3.815-3.236 1.992-.894 4.241-1.033 6.328-.392 2.088.641 3.87 2.02 5.017 3.878 1.146 1.858 1.578 4.07 1.215 6.223-.364 2.153-1.498 4.1-3.19 5.48-1.693 1.379-3.83 2.095-6.012 2.016-2.182-.08-4.26-.949-5.849-2.447-1.588-1.499-2.578-3.523-2.784-5.697-.039-.412.264-.778.676-.817.412-.04.778.263.818.675.171 1.812.996 3.499 2.32 4.748 1.323 1.248 3.055 1.973 4.874 2.04 1.818.065 3.598-.532 5.01-1.681 1.41-1.15 2.355-2.773 2.657-4.567.303-1.794-.056-3.637-1.012-5.186-.955-1.548-2.44-2.697-4.18-3.231ZM12.75 7.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v4.886l.314.224 3.5 2.5c.337.241.806.163 1.046-.174.241-.337.163-.806-.174-1.046l-3.186-2.276V7.5Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        ),
        isPublic: true,
      },
      {
        isPublic: false,
        logo: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            focusable="false"
            aria-hidden="true"
            className="pointer-events-none w-6 h-6"
          >
            <path
              clip-rule="evenodd"
              d="M3.75 5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 5 20.25 5H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 9 20.25 9H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-8.5Zm8.5 4c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h8.5Zm3.498-3.572c-.333-.191-.748.05-.748.434v6.276c0 .384.415.625.748.434L22 17l-6.252-3.572Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        ),
        to: '/',
        content: 'Playlists',
      },
      {
        isPublic: false,
        logo: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            focusable="false"
            aria-hidden="true"
            className="pointer-events-none w-6 h-6"
          >
            <path
              clip-rule="evenodd"
              d="M3.5 5.5h17v13h-17v-13ZM2 5.5C2 4.672 2.672 4 3.5 4h17c.828 0 1.5.672 1.5 1.5v13c0 .828-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.672-1.5-1.5v-13Zm7.748 2.927c-.333-.19-.748.05-.748.435v6.276c0 .384.415.625.748.434L16 12 9.748 8.427Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        ),
        to: '/',
        content: 'Your Videos',
      },
      {
        isPublic: false,
        logo: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            focusable="false"
            aria-hidden="true"
            className="pointer-events-none w-6 h-6"
          >
            <path
              clip-rule="evenodd"
              d="M20.5 12c0 4.694-3.806 8.5-8.5 8.5S3.5 16.694 3.5 12 7.306 3.5 12 3.5s8.5 3.806 8.5 8.5Zm1.5 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-9.25-5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v5.375l.3.225 4 3c.331.248.802.181 1.05-.15.248-.331.181-.801-.15-1.05l-3.7-2.775V7Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        ),
        to: '/',
        content: 'Watch later',
      },
      {
        isPublic: false,
        logo: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            focusable="false"
            aria-hidden="true"
            className="pointer-events-none w-6 h-6"
          >
            <path
              clip-rule="evenodd"
              d="M14.813 5.018 14.41 6.5 14 8h5.192c.826 0 1.609.376 2.125 1.022.711.888.794 2.125.209 3.101L21 13l.165.413c.519 1.296.324 2.769-.514 3.885l-.151.202v.5c0 1.657-1.343 3-3 3H5c-1.105 0-2-.895-2-2v-8c0-1.105.895-2 2-2h2v.282c0-.834.26-1.647.745-2.325L12 1l1.1.472c1.376.59 2.107 2.103 1.713 3.546ZM7 10.5H5c-.276 0-.5.224-.5.5v8c0 .276.224.5.5.5h2v-9Zm10.5 9h-9V9.282c0-.521.163-1.03.466-1.453l3.553-4.975c.682.298 1.043 1.051.847 1.77l-.813 2.981c-.123.451-.029.934.255 1.305.284.372.725.59 1.192.59h5.192c.37 0 .722.169.954.459.32.399.357.954.094 1.393l-.526.876c-.241.402-.28.894-.107 1.33l.165.412c.324.81.203 1.73-.32 2.428l-.152.202c-.195.26-.3.575-.3.9v.5c0 .828-.672 1.5-1.5 1.5Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        ),
        to: '/',
        content: 'Liked Videos',
      },
    ],
    hasDivider: true,
  },
  {
    to: '/',
    isPublic: false,
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        focusable="false"
        aria-hidden="true"
        className="pointer-events-none w-6 h-6"
      >
        <path
          clip-rule="evenodd"
          d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z"
          fill-rule="evenodd"
        ></path>
      </svg>
    ),
    content: 'Subscriptions',
    hasDivider: true,
  },
  {
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        focusable="false"
        aria-hidden="true"
        className="pointer-events-none w-6 h-6"
      >
        <path
          clip-rule="evenodd"
          d="m14.302 6.457-.668-.278L12.87 3.5h-1.737l-.766 2.68-.668.277c-.482.2-.934.463-1.344.778l-.575.44-2.706-.677-.868 1.504 1.938 2.003-.093.716c-.033.255-.05.514-.05.779 0 .264.017.524.05.779l.093.716-1.938 2.003.868 1.504 2.706-.677.575.44c.41.315.862.577 1.344.778l.668.278.766 2.679h1.737l.765-2.68.668-.277c.483-.2.934-.463 1.345-.778l.574-.44 2.706.677.869-1.504-1.938-2.003.092-.716c.033-.255.05-.514.05-.779 0-.264-.017-.524-.05-.779l-.092-.716 1.938-2.003-.869-1.504-2.706.677-.574-.44c-.41-.315-.862-.577-1.345-.778Zm4.436.214Zm-3.86-1.6-.67-2.346c-.123-.429-.516-.725-.962-.725h-2.492c-.446 0-.838.296-.961.725l-.67 2.347c-.605.251-1.17.58-1.682.972l-2.37-.593c-.433-.108-.885.084-1.108.47L2.717 8.08c-.223.386-.163.874.147 1.195l1.698 1.755c-.04.318-.062.642-.062.971 0 .329.021.653.062.97l-1.698 1.756c-.31.32-.37.809-.147 1.195l1.246 2.158c.223.386.675.578 1.109.47l2.369-.593c.512.393 1.077.72 1.681.972l.67 2.347c.124.429.516.725.962.725h2.492c.446 0 .839-.296.961-.725l.67-2.347c.605-.251 1.17-.58 1.682-.972l2.37.593c.433.108.885-.084 1.109-.47l1.245-2.158c.223-.386.163-.874-.147-1.195l-1.698-1.755c.04-.318.062-.642.062-.971 0-.329-.021-.653-.062-.97l1.698-1.756c.31-.32.37-.809.147-1.195L20.038 5.92c-.224-.386-.676-.578-1.11-.47l-2.369.593c-.512-.393-1.077-.72-1.681-.972ZM15.5 12c0 1.933-1.567 3.5-3.5 3.5S8.5 13.933 8.5 12s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5ZM14 12c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2Z"
          fill-rule="evenodd"
        ></path>
      </svg>
    ),
    content: 'Settings',
    to: '/',
  },
]
export const ExpendedSidebar = ({
  isMenuOpen,
  setIsMenuOpen,
  hasBackdrop = false,
  classes = 'z-40',
  toggleSidebar,
}: {
  hasBackdrop: boolean
  isMenuOpen: boolean
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
  classes?: string
  toggleSidebar: () => void
}) => {
  const isAuthenticated = !!false

  const { settings, isLoading } = useSettings()
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!settings) {
    // do something

    return <></>
  }
  return (
    // <aside className="hidden md:block  bg-zinc-800 ">
    <aside
      className={`fixed top-0 bg-zinc-200/10  h-screen ${classes ? classes : ''}`}
    >
      <BrandControls
        toggleSidebar={toggleSidebar}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        siteLogoSVG={settings.siteLogoSVG}
        classes=" lg:px-8 md:px-6 px-4 py-2  border-b border-b-slate-500 bg-zinc-800"
      />
      {/* <nav className=" sticky top-0  pt-2 "> */}
      <nav className=" top-0 pt-6 w-52 md:w-auto  overflow-y-auto h-full bg-zinc-800">
        <ul className="flex   flex-col w-full gap-2">
          {sidebarItems.map((item) => (
            <ExpendedSidebarItem
              to={item.to}
              svg={item.logo}
              label={item.content}
              hasDivider={item.hasDivider}
              subCategories={item.subCategories}
              isAuthenticated={isAuthenticated}
              isPublic={item.isPublic}
              hasSubCategories={
                item.subCategories?.length
                  ? item.subCategories.length > 0
                  : false
              }
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
}
