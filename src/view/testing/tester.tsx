import {Tester, TestHookStore, useCavy} from "cavy";
import ExampleSpec from "../../ci/exampleSpec";
import React from "react";

export { useCavy };

const testHookStore: TestHookStore | null = null;
// const testHookStore = new TestHookStore();

export function ConditionalTester({children}: any) {
    if (testHookStore && __DEV__) {
        return (
            <Tester clearAsyncStorage={false} waitTime={1000} specs={[ExampleSpec]} store={testHookStore}>
                {children}
            </Tester>
        );
    }
    return children;
}
