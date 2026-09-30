import React from 'react';
import { ArrowDown } from 'lucide-react';
export default function ViewMore({onClick, children}) {
  return <div className="catalog-more-wrap"><button type="button" className="catalog-more" onClick={onClick}><span>{children}</span><ArrowDown size={23} strokeWidth={1.8} aria-hidden="true" /></button></div>;
}
