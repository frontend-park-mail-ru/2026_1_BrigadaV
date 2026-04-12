import { SettingsModal } from "@/widgets/SettingsModal";
import { SettingsModalFormData } from "../model/types";

export const handleSubmit = async (instance: SettingsModal, data: FormData): Promise<void> => {
    const rawData = Object.fromEntries(data) as SettingsModalFormData;
    const { avatar, nickname, email, password, 'password-repeat': passwordRepeat, city, about } = rawData;


};
