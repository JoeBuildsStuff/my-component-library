'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Types
interface RegistryItem {
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

interface FileContent {
  content: string;
  path: string;
  component: string;
}

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  fullPath: string;
  children?: TreeNode[];
  fileType?: string;
}

async function fetchComponent(componentName: string): Promise<RegistryItem> {
  const response = await fetch(`/api/registry/${componentName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch component: ${componentName}`);
  }
  return response.json();
}

async function fetchFileContent(
  componentName: string, 
  filePath: string
): Promise<FileContent> {
  // Convert registry path to API path
  // For paths like "registry/ui/badge.tsx" or "registry/mode-toggle/components/mode-toggle.tsx"
  const pathWithoutRegistry = filePath.startsWith('registry/') 
    ? filePath.slice('registry/'.length) 
    : filePath;
  
  // The API path should be the path after 'registry/'
  const apiPath = pathWithoutRegistry;
  
  const response = await fetch(`/api/registry/${componentName}/files/${apiPath}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error: ${response.status} - ${errorText}`);
    throw new Error(`Failed to fetch file: ${filePath} (${response.status})`);
  }
  return response.json();
}

function buildFileTree(files: Array<{ path: string }>): TreeNode {
  const root: TreeNode = {
    name: 'root',
    type: 'folder',
    path: '',
    fullPath: '',
    children: []
  };

  files.forEach(file => {
    // Skip the 'registry' part of the path since we don't want to show it
    const pathParts = file.path.split('/').filter(Boolean);
    if (pathParts[0] === 'registry') {
      pathParts.shift(); // Remove 'registry' from the path
    }
    
    let currentNode = root;
    let currentPath = '';

    pathParts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = index === pathParts.length - 1;
      
      let childNode = currentNode.children?.find(child => child.name === part);
      
      if (!childNode) {
        childNode = {
          name: part,
          type: isFile ? 'file' : 'folder',
          path: currentPath,
          fullPath: isFile ? file.path : currentPath, // Use currentPath for folders, file.path for files
          children: isFile ? undefined : []
        };
        
        currentNode.children = currentNode.children || [];
        currentNode.children.push(childNode);
      }
      
      if (!isFile) {
        currentNode = childNode;
      }
    });
  });

  // Sort children alphabetically (folders first, then files)
  const sortChildren = (node: TreeNode) => {
    if (node.children) {
      node.children.sort((a, b) => {
        // Folders come before files
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        // Within the same type, sort alphabetically
        return a.name.localeCompare(b.name);
      });
      
      // Recursively sort children
      node.children.forEach(sortChildren);
    }
  };
  
  sortChildren(root);
  return root;
}

// File Explorer Component
export interface RegistryExplorerProps {
  /** The name of the component to explore */
  componentName: string;
  /** Optional CSS class name for styling */
  className?: string;
  /** Optional path to a specific file to select by default. If not provided, the first file will be selected. */
  defaultSelectedFile?: string;
}

export function RegistryExplorer({ componentName, className, defaultSelectedFile }: RegistryExplorerProps) {
  const [componentData, setComponentData] = useState<RegistryItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load file content
  const loadFileContent = useCallback(async (filePath: string) => {
    try {
      setFileLoading(true);
      setSelectedFile(filePath);
      const content = await fetchFileContent(componentName, filePath);
      setFileContent(content.content);
    } catch (err) {
      setFileContent(`// Error loading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setFileLoading(false);
    }
  }, [componentName]);

  // Load component data
  useEffect(() => {
    async function loadComponent() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchComponent(componentName);
        setComponentData(data);
        
        // Auto-expand all folders in the file tree
        const allFolders = new Set<string>();
        data.files.forEach(file => {
          const pathParts = file.path.split('/').filter(Boolean);
          // Skip registry prefix for folder path calculation
          if (pathParts[0] === 'registry') {
            pathParts.shift();
          }
          
          let currentPath = '';
          // Add each folder level to the expanded set
          for (let i = 0; i < pathParts.length - 1; i++) {
            currentPath = currentPath ? `${currentPath}/${pathParts[i]}` : pathParts[i];
            allFolders.add(currentPath);
          }
        });
        setExpandedFolders(allFolders);
        
        // Auto-select the first file or the specified default file
        const fileToSelect = defaultSelectedFile 
          ? data.files.find(file => file.path === defaultSelectedFile)?.path
          : data.files[0]?.path;
          
        if (fileToSelect) {
          loadFileContent(fileToSelect);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load component');
      } finally {
        setLoading(false);
      }
    }

    loadComponent();
  }, [componentName, defaultSelectedFile, loadFileContent]);

  // Build file tree
  const fileTree = useMemo(() => {
    if (!componentData) return null;
    return buildFileTree(componentData.files);
  }, [componentData]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const copyToClipboard = async () => {
    if (fileContent) {
      try {
        await navigator.clipboard.writeText(fileContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const renderTree = (node: TreeNode, level: number = 0) => {
    if (node.name === 'root') {
      return (
        <div>
          {node.children?.map(child => renderTree(child, level))}
        </div>
      );
    }

    const isExpanded = expandedFolders.has(node.type === 'folder' ? node.path : node.fullPath);
    const isSelected = selectedFile === node.fullPath;
    
    return (
      <div key={node.fullPath}>
        <div
          className={cn(
            "flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-accent/50 rounded-sm transition-colors text-muted-foreground",
            isSelected && "bg-accent text-foreground",
            level > 0 && "ml-4"
          )}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              loadFileContent(node.fullPath);
            }
          }}
          style={{ paddingLeft: `${level * 6 + 8}px` }}
        >
          {node.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="size-4 shrink-0" strokeWidth={1.5}/>
              ) : (
                <ChevronRight className="size-4 shrink-0" strokeWidth={1.5}/>
              )}
              {isExpanded ? (
                <FolderOpen className="size-4 shrink-0" strokeWidth={1.5}/>
              ) : (
                <Folder className="size-4 shrink-0" strokeWidth={1.5}/>
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="size-4 shrink-0" strokeWidth={1.5}/>
            </>
          )}
          <span className="text-sm font-medium truncate">{node.name}</span>
          {node.type === 'file' && node.fileType && (
            <span className="text-xs text-muted-foreground ml-auto">
              {node.fileType}
            </span>
          )}
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-[600px] border rounded-lg", className)}>
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading component...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-[600px] border rounded-lg", className)}>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!fileTree) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground border rounded-lg", className)}>
        Component &quot;{componentName}&quot; not found in registry
      </div>
    );
  }

  return (
    <div className={cn("flex h-[600px] border rounded-lg overflow-hidden", className)}>
      {/* File Explorer Sidebar */}
      <div className="w-[16rem] min-w-[16rem] border-r bg-muted/30 overflow-y-auto shrink-0">
        <div className="p-2">
          {renderTree(fileTree)}
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedFile ? (
          <>
            <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="size-4 shrink-0" strokeWidth={1.5}/>
                <span className="text-sm font-medium">{selectedFile.split('/').pop()}</span>
                {fileLoading && <Loader2 className="size-3 animate-spin" />}
              </div>
              <Button
                onClick={copyToClipboard}
                disabled={!fileContent || fileLoading}
                variant="outline"
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="size-4 shrink-0" strokeWidth={1.5} />
                  </>
                ) : (
                  <>
                    <Copy className="size-4 shrink-0" strokeWidth={1.5} />
                  </>
                )}
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              {fileLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading file...</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-auto h-full">
                  <div className="flex min-w-max">
                    {/* Line numbers */}
                    <div className="pl-4 py-4 select-none text-muted-foreground">
                      <pre className="text-sm font-mono leading-relaxed text-muted-foreground text-right">
                        {fileContent && fileContent.split('\n').map((_, index) => (
                          <div key={index + 1}>{index + 1}</div>
                        ))}
                      </pre>
                    </div>
                    {/* Code content */}
                    <div className="flex-1">
                      <pre className="p-4 text-sm font-mono leading-relaxed whitespace-pre">
                        <code>
                          {fileContent}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <File className="size-12 mx-auto mb-4 opacity-50" strokeWidth={1.5}/>
              <p className="text-lg font-medium mb-2">Select a file to view its contents</p>
              <p className="text-sm">Click on any file in the tree to view its source code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the RegistryExplorer as the default component
export default RegistryExplorer;