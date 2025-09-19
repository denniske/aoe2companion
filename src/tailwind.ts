import { create, ClassInput } from 'twrnc'; // this will break in twrnc 4.10
import {useColorScheme} from "nativewind";

// remove presets because twrnc doesn't support web config from expo preset
const tw = create({ ...require(`../tailwind.config.js`), presets: undefined, plugins: undefined });

export default {
    color: (color: string) => {
        return tw.color(color);
    },
    // style: (...inputs: ClassInput[]) => {
    //     console.log('tw.style', ...inputs, tw.style(...inputs));
    //     return tw.style(...inputs);
    // },
};

export function useTw() {
    const { colorScheme } = useColorScheme();

    const resolveClasses = (...inputs: ClassInput[]) => {
        const processed = inputs
            .map((input) =>
                typeof input === "string"
                    ? input
                        .split(" ")
                        .map((cls) => {
                            if (cls.startsWith("dark:")) {
                                if (colorScheme === "dark") {
                                    return cls.replace("dark:", "");
                                }
                                return null; // skip in light mode
                            }
                            return cls;
                        })
                        .filter(Boolean)
                        .join(" ")
                    : input
            )
            .filter(Boolean);

        // console.log('tw.style2', ...processed, tw.style(...(processed as ClassInput[])));

        return tw.style(...(processed as ClassInput[]));
    };

    return {
        color: (color: string) => tw.color(color),
        style: resolveClasses,
    };
}
