import { supabase } from './supabase'

export async function auth_isLoggedIn() {
    const { data } = await supabase.auth.getSession();
    if (data && data.session && data.session.access_token) {
        // console.log('User logged in with email:', data.session.user.email);
        return true;
    }
    else {
        console.log('User not logged in.');
        return false;
    }
}


export async function auth_signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log('Error signing out:', error);
        return false;
    }
    else {
        console.log('Successfully signed out');
        return true;
    }
}