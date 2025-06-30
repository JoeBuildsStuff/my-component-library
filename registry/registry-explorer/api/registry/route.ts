// src/app/api/registry/route.ts
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const registryPath = join(process.cwd(), 'registry.json');
    
    if (!existsSync(registryPath)) {
      return NextResponse.json(
        { error: 'Registry not found' },
        { status: 404 }
      );
    }

    const registryContent = await readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryContent);
    
    return NextResponse.json(registry);

  } catch (error) {
    console.error('Error reading registry:', error);
    return NextResponse.json(
      { error: 'Failed to read registry' },
      { status: 500 }
    );
  }
}



