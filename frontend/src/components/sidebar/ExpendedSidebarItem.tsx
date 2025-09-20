import React from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { ExpendedSidebarItemsType } from './ExpendedSidebar'

export const ExpendedSidebarItem = ({
  svg,
  to,
  label,
  hasDivider,
  hasSubCategories,
  subCategories,
  isAuthenticated = false,
  isPublic = false,
}: {
  isAuthenticated: boolean
  isPublic?: boolean
  to: string
  svg: React.ReactElement
  label: string
  hasDivider?: boolean
  hasSubCategories?: boolean
  subCategories?: Array<ExpendedSidebarItemsType>
}) => {
  // console.log(isAuthenticated, isPublic, label, subCategories)
  return (
    <li className={`text-sm`}>
      {hasSubCategories ? (
        <>
          {isAuthenticated && isPublic ? (
            <>
              <Link
                to={to}
                className={`text-base px-10  gap-4 flex items-center hover:bg-zinc-700`}
              >
                <span className="py-2 flex items-center font-bold">
                  {label}
                </span>
                <ChevronRight className="w-4 h-4 flex items-center" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to={to}
                className={`px-10 py-2 flex gap-4 hover:bg-zinc-700 `}
              >
                <span className="flex "> {svg}</span>
                <span className=" flex items-center">{label}</span>
              </Link>
            </>
          )}

          <ul className="mt-2">
            {subCategories ? (
              subCategories.map((item: ExpendedSidebarItemsType) => (
                <ExpendedSidebarItem
                  isAuthenticated={isAuthenticated}
                  to={item.to}
                  svg={item.logo}
                  label={item.content}
                  hasDivider={item.hasDivider}
                  isPublic={item.isPublic}
                  hasSubCategories={
                    item.subCategories?.length
                      ? item.subCategories.length > 0
                      : false
                  }
                />
              ))
            ) : (
              <></>
            )}
          </ul>
        </>
      ) : (
        <>
          {isAuthenticated || isPublic ? (
            <>
              <Link
                to={to}
                className={`px-10 py-2 flex gap-4 hover:bg-zinc-700 `}
              >
                <span className="flex "> {svg}</span>
                <span className=" flex items-center">{label}</span>
              </Link>
            </>
          ) : (
            <></>
          )}
        </>
      )}
      <>
        {hasDivider && (isAuthenticated || isPublic) ? (
          <div className="border-b-2 border-zinc-600 mt-3"></div>
        ) : (
          <></>
        )}
      </>
    </li>
  )
}
