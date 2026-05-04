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
    private photos: LocalPhoto[] = [];
    private maxPhotos = 50;
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

        this.releaseBlobUrls();
        this.photos = [];
        this.removedIds.clear();

        try {
            const album = await fetchAlbumByTripId(tripId);
            console.log('[AlbumDialog] album:', album);
            if (album) {
                this.maxPhotos = album.MaxPhotos || 50; 
                const serverPhotos = await fetchAlbumPhotos(tripId);
                console.log('[AlbumDialog] received photos from server:', serverPhotos);

                this.photos = serverPhotos.map(p => ({ id: p.id, url: p.url }));
                console.log('[AlbumDialog] mapped photos:', this.photos);

            } else {
                this.photos = [];
                Toast({ message: 'Альбом ещё не создан', type: 'error' });
            }
            console.log('[AlbumDialog] photos to render:', this.photos.length);

        } catch {
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

    const currentCount = this.photos.length;
    const availableSlots = this.maxPhotos - currentCount;

    if (availableSlots <= 0) {
        Toast({
            message: `Достигнут лимит в ${this.maxPhotos} фотографий. Удалите лишние, чтобы добавить новые.`,
            type: 'error',
        });
        input.value = '';
        return;
    }

    const filesToAdd = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
        Toast({
            message: `Можно добавить только ${availableSlots} фото. Остальные не будут загружены.`,
            type: 'error',
        });
    }

    for (const file of filesToAdd) {
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
    if (!this.tripId) {
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
                await deletePhoto(this.tripId, photo.id!);
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

    protected override handleSubmit = async(): Promise<void> => {
        console.log('[AlbumDialog] submit called, tripId =', this.tripId);

        if (!this.tripId) {
            Toast({ message: 'Невозможно сохранить: альбом не найден', type: 'error' });
            return;
        }

        try {
            //загружаем новые фото
            for (const photo of this.photos) {
                if (!photo.id && photo.file) {
                    const uploaded = await uploadPhoto(this.tripId, photo.file);
                    photo.id = uploaded.id;
                    //фото больше не blob, освобождаем
                    if (photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
                    photo.url = uploaded.url;
                }
            }

            //удаляем помеченные фото
            for (const photoId of this.removedIds) {
                await deletePhoto(this.tripId, photoId);
            }

            Toast({ message: 'Альбом сохранён', type: 'info' });
            this.element?.close();
        } catch (err) {
            Toast({ message: 'Ошибка при сохранении', type: 'error' });
        }
    }

    private renderPhotos() {
        const container = this.element?.querySelector('[data-ref="photos-container"]');
        console.log('[AlbumDialog] renderPhotos, container found:', container, 'photos count:', this.photos.length);

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

        const counter = this.element?.querySelector('[data-ref="photos-counter"]');
    if (counter) {
        counter.textContent = `${this.photos.length}/${this.maxPhotos}`;
    }
    }

    // ---------- очистка blob-URL ----------

    private releaseBlobUrls() {
        this.photos.forEach(p => {
            if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
        });
    }

    // ---------- жизненный цикл ----------

    protected override initListeners(): void {
        //super.initListeners();

        const submitBtn = this.element?.querySelector('[data-ref="submit"]');
        submitBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        const fileInput = this.element?.querySelector('[data-ref="file-input"]') as HTMLInputElement;
        fileInput?.addEventListener('change', this.handleFileChange);

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
