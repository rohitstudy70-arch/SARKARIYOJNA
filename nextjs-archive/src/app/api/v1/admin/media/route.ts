import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure dir exists
    try { await fs.access(uploadsDir); } 
    catch { await fs.mkdir(uploadsDir, { recursive: true }); }
    
    const files = await fs.readdir(uploadsDir);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const stat = await fs.stat(path.join(uploadsDir, file));
        return {
          name: file,
          url: `/uploads/${file}`,
          size: stat.size,
          createdAt: stat.birthtime
        };
      })
    );
    
    fileStats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return NextResponse.json(fileStats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try { await fs.access(uploadsDir); } 
    catch { await fs.mkdir(uploadsDir, { recursive: true }); }

    const buffer = Buffer.from(await file.arrayBuffer());
    // In a real app we might compress to WebP here with sharp, but for this constraint we just save
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    if (!name) throw new Error('File name required');
    
    const filePath = path.join(process.cwd(), 'public', 'uploads', name);
    await fs.unlink(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
