import React from 'react';
import type { ReactNode } from 'react';

export const Button = ({
  classes,
  cb,
  children,
}: {
  classes?: string;
  children: ReactNode;
  cb?: () => void;
}) => {
  return (
    <button
      className={`bg-violet-5 00 px-4 py-2 bg-violet-500 text-violet-950 font-bold shadow-[5px_5px_0px_0px] shadow-violet-800 duration-150 active:translate-[5px] active:shadow-[0px_0px_0px_0px] rounded-xs  ${classes ? classes : ''} `}
    >
      {' '}
      {children}
    </button>
  );
};
