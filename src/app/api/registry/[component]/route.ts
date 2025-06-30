// src/app/api/registry/[component]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { RegistryItem } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ component: string }> }
) {
  try {
    const { component } = await params;
    
    // Read the registry.json file
    const registryPath = join(process.cwd(), 'registry.json');
    
    if (!existsSync(registryPath)) {
      return NextResponse.json(
        { error: 'Registry not found' },
        { status: 404 }
      );
    }

    const registryContent = await readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryContent);
    
    // Find the specific component
    const componentData = registry.items?.find((item: RegistryItem) => item.name === component);
    
    if (!componentData) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(componentData);

  } catch (error) {
    console.error('Error reading registry:', error);
    return NextResponse.json(
      { error: 'Failed to read registry' },
      { status: 500 }
    );
  }
}

