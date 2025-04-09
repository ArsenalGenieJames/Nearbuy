
  //supabase connection ni siya 
  const supabaseUrl = "https://hlzxnmnurukavrybpbkm.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsenhubW51cnVrYXZyeWJwYmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzcxOTAsImV4cCI6MjA1OTYxMzE5MH0.QUiEwiUVdKTQIdfNsg043Pw09j6fjB8sI9aFOCFzZh8"; // don't expose this key in production!
  const supabase = window.supabase;
  const client = supabase.createClient(supabaseUrl, supabaseKey);

