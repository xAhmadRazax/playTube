import React, { type ReactNode } from 'react'

export const Button = ({
  classes,
  cb,
  children,
}: {
  classes: string
  children: ReactNode
  cb: () => void
}) => {
  return <button className={`${classes ? classes : ''} `}>{children}</button>
}
