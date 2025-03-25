<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">  
    <title>Log In</title>  
</head>  
<body>  
    <div class="container mt-5">  
        <h2 class="text-center">Log In</h2>  
        <form>  
            <div class="mb-3">  
                <label for="username" class="form-label">Username</label>  
                <input type="text" class="form-control" id="username" required>  
            </div>  
            <div class="mb-3">  
                <label for="password" class="form-label">Password</label>  
                <input type="password" class="form-control" id="password" required>  
            </div>  
            <div class="mb-3 form-check">  
                <input type="checkbox" class="form-check-input" id="rememberMe">  
                <label class="form-check-label" for="rememberMe">Remember Me</label>  
            </div>  
            <button type="submit" class="btn btn-primary">Log In</button>  
            <button type="button" class="btn btn-link">Forgot Password?</button>  
        </form>  
    </div>  
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>  
</body>  
</html>  