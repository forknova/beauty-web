/* eslint-disable import/prefer-default-export */

import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');

  if (!tag) {
    return Response.json({ error: 'Missing tag' }, { status: 400 });
  }

  revalidateTag(tag);

  return Response.json({ revalidated: true, now: Date.now() });
}
