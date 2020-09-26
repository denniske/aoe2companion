import {useState, useCallback, useLayoutEffect, useEffect} from "react";

function getDimensionObject(node: HTMLElement): DimensionObject {
    const rect = node.getBoundingClientRect() as any;

    return {
        width: rect.width,
        height: rect.height,
        left: "x" in rect ? rect.x : rect.left,
        top: "y" in rect ? rect.y : rect.top,
        right: rect.right,
        bottom: rect.bottom
    };
}

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useDimensions({ liveMeasure = true }: UseDimensionsArgs = {}): UseDimensionsHook {
    const [dimensions, setDimensions] = useState<DimensionObject>({} as any);
    const [node, setNode] = useState(null);

    const ref = useCallback(node => {
        setNode(node);
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (node) {
            const measure = () => {
                return window.requestAnimationFrame(() => {
                    setDimensions(oldDimensions => {
                        const newDimensions = getDimensionObject(node);
                        if (
                            oldDimensions.width === newDimensions.width &&
                            oldDimensions.height === newDimensions.height &&
                            oldDimensions.left === newDimensions.left &&
                            oldDimensions.top === newDimensions.top &&
                            oldDimensions.right === newDimensions.right &&
                            oldDimensions.bottom === newDimensions.bottom
                        ) return oldDimensions;
                        return newDimensions;
                    });
                });
            };

            measure();

            if (liveMeasure) {
                window.addEventListener("resize", measure);
                // window.addEventListener("scroll", measure);

                return () => {
                    window.removeEventListener("resize", measure);
                    // window.removeEventListener("scroll", measure);
                };
            }
        }
    }, [node]);

    return [ref, dimensions, node];
}

export interface DimensionObject {
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export type UseDimensionsHook = [
    (node: HTMLElement) => void,
    DimensionObject,
    HTMLElement
];

export interface UseDimensionsArgs {
    liveMeasure?: boolean;
}

export default useDimensions;
