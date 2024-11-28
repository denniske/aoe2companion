import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oniorzsesebsllkrgvbm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaW9yenNlc2Vic2xsa3JndmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NTIwMjIsImV4cCI6MjA0ODIyODAyMn0.nrpZ4yTKclNWqIwFTSOLEfB4364a0gaf4eSLZ7RKGQU'

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
