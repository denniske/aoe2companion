import {Animated} from "react-native";
import {useEffect, useRef, useState} from "react";


export function useAnimatedLatestValueRef(animatedValue: Animated.Value, initial?: number) {
    //If we're given an initial value then we can pretend we've received a value from the listener already
    const [latestValue, setLatestValue] = useState(initial ?? 0)
    const latestValueRef = useRef(initial ?? 0)
    const initialized = useRef(typeof initial == "number")

    useEffect(() => {
        const id = animatedValue.addListener((v) => {
            //Store the latest animated value
            latestValueRef.current = v.value
            setLatestValue(v.value);
            //Indicate that we've recieved a value
            initialized.current = true
        })

        //Return a deregister function to clean up
        return () => animatedValue.removeListener(id)

        //Note that the behavior here isn't 100% correct if the animatedValue changes -- the returned ref
        //may refer to the previous animatedValue's latest value until the new listener returns a value
    }, [animatedValue])

    return {latestValueRef, initialized} as const
}
