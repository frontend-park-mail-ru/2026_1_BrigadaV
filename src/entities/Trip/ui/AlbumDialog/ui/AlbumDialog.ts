import { BaseForm } from '@/shared/lib/component/BaseForm';
import { stringToElement } from '@/shared/utils';
import { Toast } from '@/shared/ui/Toast';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
import { fetchAlbumByTripId } from '../../../api/album';

import { AlbumDialogProps } from '../model//types';
import styles from './style.module.scss';
import template from './AlbumDialog.hbs?compiled';

type LocalPhoto = {
    url: string;        // blob-URL для предпросмотра
    file: File;         // для будущей загрузки на сервер
};

export class AlbumDialog extends BaseForm<{}, HTMLDialogElement> {
    private tripId!: number;
    private photos: LocalPhoto[] = [];

    constructor(private props: AlbumDialogProps) {
        super();
    }

    public async show(tripId: number): Promise<void> {
        this.tripId = tripId;

        try {
            await fetchAlbumByTripId(tripId);
        } catch {
        }

        this.releaseBlobUrls();
        this.photos = [];
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
        if (photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
        this.photos.splice(index, 1);
        this.renderPhotos();
    };

    private handleDeleteAll = async () => {
        if (this.photos.length === 0) return;

        const confirmed = await ConfirmPopup({
            prompt: 'Вы уверены, что хотите удалить все фотографии?',
            cancelText: 'Отменить',
            confirmText: 'Удалить',
        });

        if (confirmed) {
            this.releaseBlobUrls();
            this.photos = [];
            this.renderPhotos();
        }
    };

    //форма отправлена - заглушка
    protected override handleSubmit(): void {
        Toast({ message: 'Сохранение фотографий появится в ближайшем обновлении', type: 'info' });
        this.element?.close();
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

        const deleteAllBtn = this.element?.querySelector('[data-ref="delete-all"]');
        deleteAllBtn?.addEventListener('click', this.handleDeleteAll);

        // При закрытии диалога (крестик, Escape, кнопка «Отменить») освобождаем ресурсы
        this.element?.addEventListener('close', () => {
            this.releaseBlobUrls();
            this.photos = [];
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