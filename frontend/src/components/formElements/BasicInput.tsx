import React, { type ReactNode } from 'react'

export const BasicInput = ({
  labelText,
  type,
  labelIcon,
  inputIcon,
  labelStyles = '',
  inputStyles = '',
  placeholder,
}: {
  labelText: string
  type: 'text' | 'password'
  labelStyles: string
  inputStyles: string
  labelIcon: ReactNode
  inputIcon: ReactNode
  placeholder: string
}) => {
  return (
    <div>
      <label className={`${labelStyles}`} htmlFor="">
        <span>{labelIcon ? labelIcon : <></>}</span>
        <span>{labelIcon ? labelText : <></>}</span>
      </label>
      <input
        type={type}
        className={`${inputStyles}`}
        placeholder={placeholder}
      />
    </div>
  )
}
