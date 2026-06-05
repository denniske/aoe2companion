import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native'
import { MMKV } from 'react-native-mmkv';
import { SupabaseAuthClientOptions } from '@supabase/supabase-js/dist/module/lib/types';
import * as Sentry from '@sentry/react-native';

const mmkv = new MMKV();

const supabaseUrl = 'https://oniorzsesebsllkrgvbm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaW9yenNlc2Vic2xsa3JndmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NTIwMjIsImV4cCI6MjA0ODIyODAyMn0.nrpZ4yTKclNWqIwFTSOLEfB4364a0gaf4eSLZ7RKGQU'

const SUPABASE_MIGRATED = 'supabase_async_to_mmkv_migrated';

let supabaseClient: SupabaseClient<any, 'public', 'public', any, any>;

const mmkvStorageAdapter: SupabaseAuthClientOptions['storage'] = {
    getItem: (key: string) => {
        const value = mmkv.getString(key);
        return value ?? null;
    },
    setItem: (key: string, value: string) => {
        mmkv.set(key, value);
    },
    removeItem: (key: string) => {
        mmkv.delete(key);
    },
};

export async function migrateSupabaseStorageToMMKV() {
    if (!mmkv.getBoolean(SUPABASE_MIGRATED)) {
        try {
            console.log('MMKV migration started');

            const keys = await AsyncStorage.getAllKeys();
            const supabaseKeys = keys.filter(k => k.startsWith('sb-')); // Supabase uses sb- prefix
            if (supabaseKeys.length > 0) {
                const pairs = await AsyncStorage.multiGet(supabaseKeys);
                for (const [key, value] of pairs) {
                    console.log(`ASYN ${key}=${value}`);
                }
            }

            if (supabaseKeys.length > 0) {
                const pairs = await AsyncStorage.multiGet(supabaseKeys);
                for (const [key, value] of pairs) {
                    if (value !== null) {
                        mmkv.set(key, value);
                    }
                }
            }

            mmkv.set(SUPABASE_MIGRATED, true);

            console.log('MMKV migration succeeded');
        } catch (e) {
            console.log('MMKV migration failed:', e);
            Sentry.captureException(e, {
                extra: { context: 'supabase_mmkv_migration' },
            });
            // Don't set the flag — will retry next launch
        }
    }

    // const keys = await mmkv.getAllKeys();
    // const supabaseKeys = keys.filter((k) => k.startsWith('sb-')); // Supabase uses sb- prefix
    // if (supabaseKeys.length > 0) {
    //     for (const key of supabaseKeys) {
    //         const value = await mmkv.getString(key);
    //         console.log(`MMKV ${key}=${value}`);
    //     }
    // }

    console.log('SUPABASE USING', mmkv.getBoolean(SUPABASE_MIGRATED) ? 'MMKV' : 'ASYNC');

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            ...(Platform.OS !== 'web' ? { storage: mmkv.getBoolean(SUPABASE_MIGRATED) ? mmkvStorageAdapter : AsyncStorage } : {}),
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    });
}


export function getSupabaseClient() {
    if (supabaseClient == null) {
        throw new Error('getSupabaseClient() Client not initialized yet.');
    }
    return supabaseClient;
}

// console.log('==> INITIALIZED SUPABASE MODULE');
