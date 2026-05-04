import { BaseForm } from '@/shared/lib/component/BaseForm';
import { stringToElement } from '@/shared/utils';
import { Toast } from '@/shared/ui/Toast';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
import { fetchAlbumByTripId, fetchAlbumPhotos, uploadPhoto, deletePhoto } from '../../../api/album';

import { AlbumDialogProps } from '../model//types';
import styles from './style.module.scss';
import template from './AlbumDialog.hbs?compiled';

type LocalPhoto = {
    id?: number;
    url: string;        // blob-URL для предпросмотра или серверный url
    file?: File;        // для загрузки на сервер (только для новых)
};

export class AlbumDialog extends BaseForm<{}, HTMLDialogElement> {
    private tripId!: number;
    private albumId: number | null = null;
    private photos: LocalPhoto[] = [];
    private removedIds = new Set<number>();

    constructor(private props: AlbumDialogProps) {
        super();
    }

    public async show(tripId: number): Promise<void> {
    console.group('[AlbumDialog.show]');
    console.log('Received tripId:', tripId);
    console.log('Type of tripId:', typeof tripId);
    console.log('Is undefined?', tripId === undefined);
    console.log('Is null?', tripId === null);
    console.log('Is NaN?', isNaN(tripId as number));
    console.log('String value:', String(tripId));
    console.trace('Call stack:');
    console.groupEnd();
        if (!tripId || isNaN(tripId)) {
            console.error('[AlbumDialog] Invalid tripId, showing error toast');
            Toast({ message: 'Не удалось определить поездку', type: 'error' });
            return;
        }

        this.tripId = tripId;
        this.releaseBlobUrls();
        this.photos = [];
        this.removedIds.clear();

        try {
            const album = await fetchAlbumByTripId(tripId);
            if (album) {
                this.albumId = album.ID;
                const serverPhotos = await fetchAlbumPhotos(this.albumId);
                this.photos = serverPhotos.map(p => ({ id: p.id, url: p.url }));
            } else {
                this.albumId = null;
                this.photos = [];
            }
        } catch {
            this.albumId = null;
            this.photos = [];
            Toast({ message: 'Не удалось загрузить альбом', type: 'error' });
        }

        this.renderPhotos();
        this.element?.showModal();
    }

    private handleFileChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const files = input.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            if (!file.type.startsWith('image/')) {
                Toast({ message: 'Можно загружать только изображения', type: 'error' });
                continue;
            }
            const blobUrl = URL.createObjectURL(file);
            this.photos.push({ url: blobUrl, file });
        }
        input.value = '';
        this.renderPhotos();
    };

    private handleRemovePhoto = (index: number) => {
        const photo = this.photos[index];
        if (photo.id !== undefined) {
            this.removedIds.add(photo.id);
        } else if (photo.url.startsWith('blob:')) {
            URL.revokeObjectURL(photo.url);
        }
        this.photos.splice(index, 1);
        this.renderPhotos();
    };

    private handleDeleteAlbum = async () => {
        if (!this.albumId) {
            Toast({ message: 'Альбом ещё не создан', type: 'error' });
            return;
        }

        const savedPhotos = this.photos.filter(p => p.id !== undefined);
        if (savedPhotos.length === 0) {
            Toast({ message: 'В альбоме нет сохранённых фотографий', type: 'info' });
            this.element?.close();
            return;
        }

        const confirmed = await ConfirmPopup({
            prompt: 'Вы действительно хотите удалить все фотографии из альбома?',
            note: 'Это действие нельзя отменить.',
            cancelText: 'Отменить',
            confirmText: 'Удалить',
        });

        if (confirmed) {
            try {
                for (const photo of savedPhotos) {
                    await deletePhoto(this.albumId, photo.id!);
                }
                Toast({ message: 'Альбом очищен', type: 'info' });
            } catch {
                Toast({ message: 'Не удалось удалить все фотографии', type: 'error' });
            } finally {
                this.releaseBlobUrls();
                this.photos = [];
                this.removedIds.clear();
                this.renderPhotos();
                this.element?.close();
            }
        }
    };

    protected override async handleSubmit(): Promise<void> {
        if (!this.albumId) {
            Toast({ message: 'Невозможно сохранить: альбом не найден', type: 'error' });
            return;
        }

        try {
            // Загружаем новые фото
            for (const photo of this.photos) {
                if (!photo.id && photo.file) {
                    const uploaded = await uploadPhoto(this.albumId, photo.file);
                    photo.id = uploaded.id;
                    if (photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
                    photo.url = uploaded.url;
                }
            }

            // Удаляем помеченные фото
            for (const photoId of this.removedIds) {
                await deletePhoto(this.albumId, photoId);
            }
            this.removedIds.clear();

            Toast({ message: 'Альбом сохранён', type: 'info' });
            this.element?.close();
        } catch {
            Toast({ message: 'Ошибка при сохранении', type: 'error' });
        }
    }

    private renderPhotos() {
        const container = this.element?.querySelector('[data-ref="photos-container"]');
        if (!container) return;
        container.innerHTML = '';

        this.photos.forEach((photo, index) => {
            const div = document.createElement('div');
            div.className = styles['photo-item'];

            const img = document.createElement('img');
            img.src = photo.url;
            img.className = styles['photo-item__img'];

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = styles['photo-item__remove'];
            removeBtn.innerHTML = `<img src="/icons/x.svg" alt="Удалить">`;
            removeBtn.addEventListener('click', () => this.handleRemovePhoto(index));

            div.appendChild(img);
            div.appendChild(removeBtn);
            container.appendChild(div);
        });
    }

    private releaseBlobUrls() {
        this.photos.forEach(p => {
            if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
        });
    }

    protected override initListeners(): void {
        super.initListeners();

        const fileInput = this.element?.querySelector('[data-ref="file-input"]') as HTMLInputElement;
        fileInput?.addEventListener('change', this.handleFileChange);

        const deleteAlbumBtn = this.element?.querySelector('[data-ref="delete-all"]');
        deleteAlbumBtn?.addEventListener('click', this.handleDeleteAlbum);

        this.element?.addEventListener('close', () => {
            this.releaseBlobUrls();
            this.photos = [];
            this.removedIds.clear();
        });
    }

    protected override _render(): HTMLDialogElement {
        return stringToElement<HTMLDialogElement>(template({
            ...this.props,
            styles,
        }));
    }

    public override destroy() {
        this.releaseBlobUrls();
        super.destroy();
    }
}
