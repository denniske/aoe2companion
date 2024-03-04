import { createContext, useContext } from 'react';

export const ScrollableContext = createContext({ scrollPosition: 0, setScrollToTop: (_: string) => {} });
export const useScrollable = () => useContext(ScrollableContext);

export const ScrollContext = createContext<{ setScrollPosition: (pos: number) => void; scrollToTop?: string }>({
    setScrollPosition: (_: number) => {},
});
export const useScroll = () => useContext(ScrollContext);
