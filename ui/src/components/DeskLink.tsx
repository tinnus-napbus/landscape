import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCharge } from '../state/docket';
import { Destination } from '@/gear';
import { getAppHref } from '@/logic/utils';

interface DeskLinkProps extends React.AnchorHTMLAttributes<any> {
  desk: string;
  to: Destination;
  children?: ReactNode;
  className?: string;
}

export function DeskLink({
  children,
  className,
  desk,
  to,
  ...rest
}: DeskLinkProps) {
  const navigate = useNavigate();
  const charge = useCharge(desk);

  if (!charge) {
    return null;
  }

  if (desk === window.desk) {
    if ('int' in to && to.int != null) {
      return (
        <Link to={to.int} className={className} {...rest}>
          {children}
        </Link>
      );
    }
  }

  let href = ''

  if ('int' in to && to.int != null) {
    console.log('to internal', to.int)
    const intUrl = to.int.startsWith('/') ? to.int.slice(1) : to.int;
    href = `${getAppHref(charge.href)}${intUrl}`;
  }else if('ext' in to && to.ext != null){
    href = to.ext;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      {...rest}
      onClick={(event) => {
        if (rest.onClick) {
          rest.onClick(event);
        }
        navigate('/');
      }}
    >
      {children}
    </a>
  );
}
