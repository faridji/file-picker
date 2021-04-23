export interface CustomFile {
    file_id?: number;
    file_name: string;
    file_url?: string;
    file_size?: string;

    progress_value: number;
    error_message: string;
    selected?: boolean;
}

export interface FileDimensions {
    width: number;
    height: number;
}