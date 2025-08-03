import axios from 'axios';
import { ApiResponse } from '../types';

// Base URL for the MCP server
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

/**
 * Service to handle API communication with the MCP server
 */
export const apiService = {
  /**
   * Send a command to the MCP server
   * @param command - The command text to send
   */
  sendCommand: async (command: string): Promise<ApiResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/command`, { command });
      return response.data;
    } catch (error) {
      console.error('Error sending command to MCP server:', error);
      return {
        success: false,
        message: 'Failed to communicate with server. Please try again later.'
      };
    }
  },
};
