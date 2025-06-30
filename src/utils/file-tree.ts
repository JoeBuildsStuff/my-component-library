// utils/file-tree.ts - Utility for building file trees
export interface TreeNode {
    name: string;
    type: 'folder' | 'file';
    path: string;
    fullPath: string;
    children?: TreeNode[];
    fileType?: string;
  }
  
  export function buildFileTree(files: Array<{ path: string }>): TreeNode {
    const root: TreeNode = {
      name: 'root',
      type: 'folder',
      path: '',
      fullPath: '',
      children: []
    };
  
    files.forEach(file => {
      const pathParts = file.path.split('/').filter(Boolean);
      let currentNode = root;
      let currentPath = '';
  
      pathParts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = index === pathParts.length - 1;
        
        // Find existing node or create new one
        let childNode = currentNode.children?.find(child => child.name === part);
        
        if (!childNode) {
          childNode = {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            fullPath: file.path,
            children: isFile ? undefined : []
          };
          
          if (isFile) {
            childNode.fileType = getFileType(part);
          }
          
          currentNode.children = currentNode.children || [];
          currentNode.children.push(childNode);
        }
        
        if (!isFile) {
          currentNode = childNode;
        }
      });
    });
  
    return root;
  }
  
  function getFileType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'typescript';
      case 'jsx':
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
      case 'mdx':
        return 'markdown';
      default:
        return 'text';
    }
  }