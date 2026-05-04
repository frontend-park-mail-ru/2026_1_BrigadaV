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
    url: string;        // blob-URL для предпросмотра
    file?: File;         // для будущей загрузки на сервер
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
        if (!tripId) {
        Toast({ message: 'Ошибка: не указан ID поездки', type: 'error' });
        return;
    }
        
        this.tripId = tripId;
        console.log('[AlbumDialog] show() called');
        console.log('tripId value:', tripId);
        console.log('tripId type:', typeof tripId);
        console.log('isNaN?', isNaN(tripId as number));
        if (!tripId || isNaN(tripId as number)) {
        console.error('CRITICAL: tripId is invalid! Cannot proceed.');
        Toast({ message: 'Ошибка: ID поездки не указан', type: 'error' });
        return;
    }

    this.tripId = tripId;
    console.log('this.tripId set to:', this.tripId);
        try {
            const album = await fetchAlbumByTripId(tripId);
            if (album) {
                const serverPhotos = await fetchAlbumPhotos(tripId);
                this.photos = serverPhotos.map(p => ({ id: p.id, url: p.url }));
            } else {
                this.photos = [];
                Toast({ message: 'Альбом ещё не создан', type: 'error' });
            }

            this.releaseBlobUrls();
            this.photos = [];
            this.renderPhotos();

            this.element?.showModal();
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
        input.value = '';   // чтобы можно было повторно выбрать тот же файл (?)
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

/*    private handleDeleteAll = async () => {
        if (this.photos.length === 0) return;

        const confirmed = await ConfirmPopup({
            prompt: 'Вы уверены, что хотите удалить все фотографии?',
            cancelText: 'Отменить',
            confirmText: 'Удалить',
        });

        if (confirmed) {
            try {
                await deleteAlbum(this.tripId);
                Toast({ message: 'Альбом удалён', type: 'info' });
                this.element?.close();
            } catch {
                Toast({ message: 'Не удалось удалить альбом', type: 'error' });
            }
        }
    };*/

    private handleDeleteAlbum = async () => {
    if (!this.albumId) {
        Toast({ message: 'Альбом ещё не создан', type: 'error' });
        return;
    }

    // Собираем только сохранённые на сервере фото (у которых есть id)
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
            // Удаляем каждое сохранённое фото по одному
            for (const photo of savedPhotos) {
                await deletePhoto(this.albumId, photo.id!);
            }
            Toast({ message: 'Альбом очищен', type: 'info' });
        } catch {
            Toast({ message: 'Не удалось удалить все фотографии', type: 'error' });
        } finally {
            // Очищаем локальное состояние и закрываем диалог
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
            //загружаем новые фото
            for (const photo of this.photos) {
                if (!photo.id && photo.file) {
                    const uploaded = await uploadPhoto(this.albumId, photo.file);
                    photo.id = uploaded.id;
                    //фото больше не blob, освобождаем
                    if (photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
                    photo.url = uploaded.url;
                }
            }

            //удаляем помеченные фото
            for (const photoId of this.removedIds) {
                await deletePhoto(this.albumId, photoId);
            }

            Toast({ message: 'Альбом сохранён', type: 'info' });
            this.element?.close();
        } catch (err) {
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

    // ---------- очистка blob-URL ----------

    private releaseBlobUrls() {
        this.photos.forEach(p => {
            if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
        });
    }

    // ---------- жизненный цикл ----------

    protected override initListeners(): void {
        super.initListeners();

        const fileInput = this.element?.querySelector('[data-ref="file-input"]') as HTMLInputElement;
        fileInput?.addEventListener('change', this.handleFileChange);

/*        const deleteAllBtn = this.element?.querySelector('[data-ref="delete-all"]');
        deleteAllBtn?.addEventListener('click', this.handleDeleteAll);*/

        const deleteAlbumBtn = this.element?.querySelector('[data-ref="delete-all"]');
        deleteAlbumBtn?.addEventListener('click', this.handleDeleteAlbum);

        // При закрытии диалога (крестик, Escape, кнопка «Отменить») освобождаем ресурсы
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
