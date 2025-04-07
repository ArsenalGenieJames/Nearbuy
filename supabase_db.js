import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://hlzxnmnurukavrybpbkm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsenhubW51cnVrYXZyeWJwYmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzcxOTAsImV4cCI6MjA1OTYxMzE5MH0.QUiEwiUVdKTQIdfNsg043Pw09j6fjB8sI9aFOCFzZh8')

export async function signUp(email, password) {  
    const { user, error } = await supabase.auth.signUp({  
        email,  
        password,  
    });  

    if (error) {  
        alert(`Error: ${error.message}`);  
    } else {  
        alert('Account created successfully! Check your email for confirmation.');  
    }  
}  

// Log in function  
export async function logIn(email, password) {  
    const { user, error } = await supabase.auth.signInWithPassword({  
        email,  
        password,  
    });  

    if (error) {  
        alert(`Error: ${error.message}`);  
    } else {  
        alert(`Welcome back, ${user.email}!`);  
        // Optionally, redirect to a dashboard or home page  
    }  
}  