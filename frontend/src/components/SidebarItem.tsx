// import React from 'react'
// import { Link } from '@tanstack/react-router'
// import { ChevronRight } from 'lucide-react'
// import type { ExpendedSidebarItemsType } from './Sidebar'

// export const SidebarItem = ({
//   logo,
//   content,
//   to,
//   isMenuOpen = false,
//   isExpendedSidebar = false,
//   isPublic = false,
//   subCategories = [],
//   hasDivider = false,
// }: {
//   logo: React.ReactElement
//   content: string
//   to: string
//   isMenuOpen: boolean
//   isExpendedSidebar?: boolean
//   isPublic?: boolean
//   subCategories?: [] | Array<ExpendedSidebarItemsType>
//   hasDivider?: boolean
// }) => {
//   const isAuthenticated = true
//   return (
//     <>
//       {isMenuOpen || isExpendedSidebar ? (
//         <li className="w-full flex flex-col px-10 ">
//           {/* so whats the plan the plan is to show the public link item if the user is loged in */}
//           {isAuthenticated === true && subCategories.length > 0 ? (
//             // this is the first link of the menu item that has childrens
//             <>
//               <Link
//                 to={to}
//                 className="flex items-center  gap-2 hover:bg-zinc-950 "
//               >
//                 <div className="flex">
//                   <span>{content} </span>

//                   <span className="flex items-center">
//                     <ChevronRight className="w-5 h-5" />
//                   </span>
//                 </div>
//               </Link>
//               <ul>
//                 {subCategories.map((item) => (
//                   <SidebarItem
//                     isMenuOpen={isMenuOpen}
//                     content={item.content}
//                     logo={item.logo}
//                     key={item.content}
//                     to={item.to}
//                     isPublic={item.isPublic}
//                     subCategories={item.subCategories || []}
//                     hasDivider={item.hasDivider || false}
//                   />
//                 ))}
//               </ul>
//             </>
//           ) : (
//             <Link
//               to={to}
//               className="inline-flex items-center gap-2 hover:bg-zinc-950 "
//             >
//               <span className="flex ">{logo}</span>
//               <span className="text-base  flex items-center">{content}</span>
//             </Link>
//           )}
//         </li>
//       ) : (
//         // item for collapse menu
//         <li>
//           <Link to={to} className="flex flex-col">
//             <span className="flex justify-center">{logo}</span>
//             <span className="text-xs"> {content}</span>
//           </Link>
//         </li>
//       )}
//     </>
//   )
// }
