import {useEffect, useState} from "react";
import {AuthUser} from "@supabase/supabase-js";
import { supabaseClient } from '../helper/supabase';

export default function useAuth() {
    const [session, setSession] = useState<any | undefined>();
    const [user, setUser] = useState<AuthUser | undefined>();

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            // console.log('getSession', session?.user);
            setSession(session);
            setUser(session?.user);
        })

        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            // console.log('onAuthStateChange', session?.user);
            setSession(session);
            setUser(session?.user);
        })

        return () => subscription.unsubscribe()
    }, [])

    return user;
}
