// lib/api.ts - Client-side API functions
export interface RegistryItem {
    name: string;
    type: string;
    title: string;
    description: string;
    files: Array<{
      path: string;
      type: string;
      target: string;
    }>;
    dependencies?: string[];
    registryDependencies?: string[];
  }
  
  export interface Registry {
    items: RegistryItem[];
  }
  
  export interface FileContent {
    content: string;
    path: string;
    component: string;
  }
  
  // Fetch the full registry
  export async function fetchRegistry(): Promise<Registry> {
    const response = await fetch('/api/registry');
    if (!response.ok) {
      throw new Error('Failed to fetch registry');
    }
    return response.json();
  }
  
  // Fetch a specific component's data
  export async function fetchComponent(componentName: string): Promise<RegistryItem> {
    const response = await fetch(`/api/registry/${componentName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch component: ${componentName}`);
    }
    return response.json();
  }
  
  // Fetch file content
  export async function fetchFileContent(
    componentName: string, 
    filePath: string
  ): Promise<FileContent> {
    // Convert registry path to API path
    // e.g., "registry/ui/badge.tsx" -> "ui/badge.tsx"
    const pathWithoutRegistry = filePath.startsWith('registry/') 
      ? filePath.slice('registry/'.length) 
      : filePath;
    
    // Remove component name from path if it's there
    const pathParts = pathWithoutRegistry.split('/');
    if (pathParts[0] === componentName) {
      pathParts.shift();
    }
    
    const apiPath = pathParts.join('/');
    
    const response = await fetch(`/api/registry/${componentName}/files/${apiPath}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${filePath}`);
    }
    return response.json();
  }