// src/app/api/registry/[component]/files/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ component: string; path: string[] }> }
) {
  try {
    const { component, path } = await params;
    
    // Reconstruct the full path
    const fullPath = path.join('/');
    
    // The file path should be: registry + fullPath
    const filePath = join(process.cwd(), 'registry', fullPath);
    
    console.log(`Attempting to read file: ${filePath}`);
    
    // Security check: ensure the path is within the registry directory
    const registryPath = join(process.cwd(), 'registry');
    if (!filePath.startsWith(registryPath)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json(
        { error: `File not found: ${fullPath}` },
        { status: 404 }
      );
    }

    // Read file content
    const content = await readFile(filePath, 'utf-8');
    
    return NextResponse.json({
      content,
      path: fullPath,
      component
    });

  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}