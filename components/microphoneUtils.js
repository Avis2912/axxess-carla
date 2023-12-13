// Create a new file (e.g., microphonePermissionUtils.js) to define the functions

// Check if microphone permission is granted
export async function checkMicrophonePermission() {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
      return permissionStatus.state;
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return 'denied'; // Default to denied in case of an error
    }
  }
  
  // Request microphone access
  export async function requestMicrophoneAccess() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return 'granted';
    } catch (error) {
      console.error('Error requesting microphone access:', error);
      return 'denied';
    }
  }
  