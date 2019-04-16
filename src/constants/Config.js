export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = "4c947fa7e9c94ca1b0a67317cb6d9b6f";
export const redirectUri = window.location.origin + "/callback";
export const scopes = [
    "streaming",                        // Control playback of a Spotify track. Must have premium account
    "app-remote-control",               // Remote control playback of Spotify.
    "user-read-email",                  // Read access to user’s email address. 
    "user-read-private",                // Read access to user’s subscription details (type of user account).     
    "user-top-read",                    // Read access to a user's top artists and tracks. 
    "user-read-currently-playing",      // Read access to a user’s currently playing track. 
    "user-read-playback-state",         // Read access to a user’s player state.
    "user-modify-playback-state",       // Write access to a user’s playback state.
    "playlist-read-private",            // Read access to user's private playlists. 
    "playlist-modify-private",          // Write access to a user's private playlists. 
    "playlist-modify-public",           // Write access to a user's public playlists. 
    "playlist-read-collaborative",      // Include collaborative playlists when requesting a user's playlists.
];