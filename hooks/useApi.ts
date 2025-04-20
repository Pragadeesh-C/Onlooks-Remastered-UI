import { config } from '@/config';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface ErrorResponse {
  detail?: string;
}

export function useApi() {
  const router = useRouter();
  const { toast } = useToast();

  const handleTokenExpiration = () => {
    // Clear the expired token
    localStorage.removeItem('token');
    
    // Show toast notification
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please log in again.",
      variant: "destructive",
      duration: 3000,
    });

    // Redirect to login
    router.push('/login');
  };

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
    try {
      // For OPTIONS requests, don't include the token
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (options.method !== 'OPTIONS' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${config.apiUrl}${endpoint}`, {
        ...options,
        credentials: 'include',
        mode: 'cors',
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle OPTIONS preflight response
      if (response.status === 204 && options.method === 'OPTIONS') {
        return response;
      }

      // Handle 401 Unauthorized before trying to parse JSON
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({ detail: "Unauthorized" }));
        if (errorData.detail === "Token has expired") {
          handleTokenExpiration();
        }
        throw new Error(errorData.detail || "Unauthorized");
      }

      if (!response.ok) {
        let errorData: ErrorResponse = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // If parsing fails, use status text
          errorData = { detail: response.statusText };
        }
        
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Check if error is due to token expiration
      if (error instanceof Error && error.message === "Token has expired" || error instanceof Error && error.message === "Could not validate credentials") {
        handleTokenExpiration();
      }
      
      // Handle CORS errors
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your connection and try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      throw error;
    }
  };

  return { fetchWithAuth };
} 