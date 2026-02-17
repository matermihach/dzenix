import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export async function uploadImage(file: File, folder: string = 'images'): Promise<{ url: string; error: string | null }> {
  try {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);

    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return { url, error: null };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { url: '', error: error.message || 'Failed to upload image' };
  }
}

export async function deleteImage(imageUrl: string): Promise<{ error: string | null }> {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return { error: null };
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return { error: error.message || 'Failed to delete image' };
  }
}
