// Demo Cookies
if (!document.cookie.includes('sessionId')) {
    document.cookie = "sessionId=abc123def456ghi789; path=/";
    document.cookie = "userPrefs=theme:dark;lang:de; path=/";
    document.cookie = "authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; path=/";
    document.cookie = "userName=MaxMustermann; path=/";
    document.cookie = "userEmail=max.mustermann@example.de; path=/";
}
