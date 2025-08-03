import axios from 'axios';
import { ApiResponse } from '../types';

// Base URL for the MCP server
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Mock data for demo purposes
const mockEmployees = [
  { name: "John Smith", title: "Software Engineer", department: "Engineering", email: "john@example.com" },
  { name: "Emily Johnson", title: "Product Manager", department: "Product", email: "emily@example.com" },
  { name: "Michael Brown", title: "UX Designer", department: "Design", email: "michael@example.com" },
  { name: "Sarah Davis", title: "HR Manager", department: "Human Resources", email: "sarah@example.com" }
];

// Mock response generation
const generateMockResponse = (command: string): ApiResponse => {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('employee') || lowerCommand.includes('staff') || lowerCommand.includes('people')) {
    if (lowerCommand.includes('list') || lowerCommand.includes('all') || lowerCommand.includes('show')) {
      return {
        success: true,
        message: `Here are our employees:\n${mockEmployees.map(emp => `- ${emp.name}, ${emp.title}`).join('\n')}`,
        data: mockEmployees
      };
    }
    
    // Search for specific employee
    for (const emp of mockEmployees) {
      if (lowerCommand.includes(emp.name.toLowerCase())) {
        return {
          success: true,
          message: `${emp.name} is a ${emp.title} in the ${emp.department} department. Contact: ${emp.email}`,
          data: emp
        };
      }
    }
    
    // Search by department
    const deptMatches = mockEmployees.filter(emp => 
      lowerCommand.includes(emp.department.toLowerCase())
    );
    
    if (deptMatches.length > 0) {
      return {
        success: true,
        message: `Found ${deptMatches.length} employees in that department:\n${deptMatches.map(emp => `- ${emp.name}, ${emp.title}`).join('\n')}`,
        data: deptMatches
      };
    }
  }
  
  // Default response
  return {
    success: true,
    message: "I can help you find information about employees. Try asking about specific employees, departments, or request a list of all employees.",
  };
};

/**
 * Service to handle API communication with the MCP server
 */
export const apiService = {
  /**
   * Send a command to the MCP server
   * @param command - The command text to send
   */
  sendCommand: async (command: string): Promise<ApiResponse> => {
    // For demonstration, we'll use a mock implementation
    // In a real app, this would call the actual API
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use our mock implementation
      return generateMockResponse(command);
      
      // Real implementation would be:
      // const response = await axios.post(`${API_BASE_URL}/api/command`, { command });
      // return response.data;
    } catch (error) {
      console.error('Error handling command:', error);
      return {
        success: false,
        message: 'Failed to process your request. Please try again later.'
      };
    }
  },
};
