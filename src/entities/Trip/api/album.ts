import { request } from '@/shared/api';

import { Album, AlbumPhoto } from '../model/types';

const BASE = '/albums';

// GET /api/trips/{tripId}/album
export async function fetchAlbumByTripId(tripId: number): Promise<Album | null> {
    const album = await request<Album>(`/trips/${tripId}/album`, { method: 'GET' });
    return album.ok ? album.data : null;
}

// PUT /api/albums/{id}
export async function updateAlbum(album: Album): Promise<Album> {
    const updated = await request<Album>(`${BASE}/${album.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(album),
    });
    if (!updated.ok) throw new Error('Failed to update album');
    return updated.data;
}

// DELETE /api/albums/{id}
/*export async function deleteAlbum(tripId: number): Promise<void> {
    await request(`${BASE}/${tripId}`, { method: 'DELETE' });
}*/


// Получить все фото альбома
export async function fetchAlbumPhotos(albumId: number): Promise<AlbumPhoto[]> {
    const photos = await request<AlbumPhoto[]>(`${BASE}/${albumId}/photos`, { method: 'GET' });
    return photos.ok ? photos.data : [];
}

// Загрузить одно фото в альбом
export async function uploadPhoto(albumId: number, file: File): Promise<AlbumPhoto> {
    const formData = new FormData();
    formData.append('photo', file);   //'photo' (?)

    const photo = await request<AlbumPhoto>(`${BASE}/${albumId}/photos`, {
        method: 'POST',
        body: formData,
    });
    if (!photo.ok) throw new Error('Failed to upload photo');
    return photo.data;
}

// Удалить одно фото
export async function deletePhoto(albumId: number, photoId: number): Promise<void> {
    await request(`${BASE}/${albumId}/photos/${photoId}`, { method: 'DELETE' });
}
