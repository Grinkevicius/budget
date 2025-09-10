"use client";

import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import {useAlert} from '@/contexts/AlertContext';

const CameraCapture: React.FC = () => {
    const [photo, setPhoto] = useState<string | null>(null);
    const {showAlert} = useAlert();

    const takePhoto = async (): Promise<void> => {
        try {
            const image: Photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
            });

            if (image.dataUrl) {
                setPhoto(image.dataUrl);
            }
        } catch (error) {
            console.error('Camera error:', error);
            handleError(error);
        }
    };
    
    const handleSuccess = () => {
        showAlert({
            type: 'success',
            title: 'Success',
            description: 'Operation completed successfully',
        });
    }

    const handleError = (error: unknown) => {
        showAlert({
            type: 'error',
            title: 'Error',
            description: (error as Error)?.message || 'An error occurred while capturing photo',
        });
    }

    return (
        <div>
            <button onClick={takePhoto}>Take Photo</button>
            {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Captured" style={{ maxWidth: '100%', marginTop: '1rem' }} />
            )}
            <div className="">
                <button onClick={handleSuccess}>success</button>
            </div>

            <div className="">
                <button onClick={handleError}>error</button>
            </div>
        </div>
    );
};

export default CameraCapture;
