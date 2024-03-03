import { createContext, useContext } from 'react';

export const ScrollableContext = createContext({ scrollPosition: 0 });
export const useScrollable = () => useContext(ScrollableContext);

export const ScrollContext = createContext({ setScrollPosition: (pos: number) => {} });
export const useScroll = () => useContext(ScrollContext);
