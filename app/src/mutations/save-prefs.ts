import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPrefs } from '@app/queries/prefs';

export const asdjasd = 3;

// export const savePrefsToStorage = async (prefs: Partial<IPrefs>) => {
//     await AsyncStorage.mergeItem('prefs', JSON.stringify(prefs));
// };
//
// export const useSavePrefsMutation = () => {
//     const queryClient = useQueryClient();
//
//     return useMutation({
//         mutationKey: ['savePrefs'],
//         mutationFn: savePrefsToStorage,
//         onMutate: async (_prefs) => {
//             console.log('ON MUTATE');
//             await queryClient.cancelQueries({ queryKey: QUERY_KEY_PREFS() });
//             const previousPrefs = queryClient.getQueryData(QUERY_KEY_PREFS()) as {};
//             queryClient.setQueryData(QUERY_KEY_PREFS(), {
//                 ...previousPrefs,
//                 _prefs
//             });
//             return { previousPrefs, _prefs };
//         },
//         onError: (err, _prefs, context) => {
//             console.log('ON ERROR', err);
//             queryClient.setQueryData(QUERY_KEY_PREFS(), context?.previousPrefs);
//         },
//         onSettled: async (_prefs) => {
//             console.log('ON SETTLED');
//             console.log('ON SETTLED IS PENDING', queryClient.isMutating({ mutationKey: ['savePrefs'] }));
//             if (queryClient.isMutating({ mutationKey: ['savePrefs'] }) === 1) {
//                 await queryClient.invalidateQueries({ queryKey: QUERY_KEY_PREFS() }); // , refetchType: 'all'
//                 console.log('ON SETTLED INVALIDATED');
//             }
//         },
//     });
// };
