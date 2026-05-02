import { request } from '@/shared/api';
import { Album } from '../model/types';

const BASE = '/api/albums';

// GET /api/trips/{tripId}/album
export async function fetchAlbumByTripId(tripId: number): Promise<Album | null> {
    const album = await request<Album>(`/api/trips/${tripId}/album`, { method: 'GET' });
    return album ?? null;
}

// PUT /api/albums/{id}
export async function updateAlbum(album: Album): Promise<Album> {
    const updated = await request<Album>(`${BASE}/${album.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(album),
    });
    if (!updated) throw new Error('Failed to update album');
    return updated;
}

// DELETE /api/albums/{id}
export async function deleteAlbum(tripId: number): Promise<void> {
    await request(`${BASE}/${tripId}`, { method: 'DELETE' });
}

//плюс загрузка и удаление фото