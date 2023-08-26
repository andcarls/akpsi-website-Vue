// Note: The below URL and AnonKey are intended to be public
//       They do not allow any unwanted access due to Supabase's internal RLS and Auth polices
//       Do not modify unless they change
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ahuptqdhadtbesxvhuzz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodXB0cWRoYWR0YmVzeHZodXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk5OTUxNTMsImV4cCI6MjAwNTU3MTE1M30.6B9CbVDoMHnSJWjm-KCBpJz0oj5MIIaszmKgx2QGV7w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)