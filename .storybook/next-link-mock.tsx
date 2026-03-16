import React from "react";

export default function Link({ children, href, prefetch, replace, scroll, shallow, locale, ...props }: any) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
