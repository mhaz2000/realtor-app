import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadExcelTemplate, UploadExcel } from '../../api/admin';
import FileDropZone from '../../components/FileDropZone';
import ReactDatePicker from 'react-datepicker';

const UploadExcelPage: React.FC = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [creationDate, setCreationDate] = useState<Date | null>(new Date());
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // new error message state

    const handleDownload = async () => {
        try {
            setLoading(true);
            setErrorMessage(null);
            const blob = await DownloadExcelTemplate();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setErrorMessage(t('download_failed') || 'Failed to download template');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setUploadSuccess(null);

        if (!file) {
            setErrorMessage(t('please_select_file') || 'Please select a file to upload.');
            return;
        }
        if (!creationDate || !address) {
            setErrorMessage(t('please_fill_all_fields') || 'Please fill all fields.');
            return;
        }
        try {
            setLoading(true);
            await UploadExcel(creationDate ? creationDate.toISOString().split('T')[0] : '', address, file);
            setUploadSuccess(true);
            setFile(null);
            setCreationDate(new Date());
            setAddress('');
        } catch (error) {
            setUploadSuccess(false);
            setErrorMessage(t('upload_failed') || 'Failed to upload file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
                {t('excel_template_management') || 'Excel Template Management'}
            </h1>

            <div className="flex justify-center mb-8">
                <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
                    aria-label="Download Excel Template"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0-8l-4 4m4-4l4 4M12 4v8" />
                    </svg>
                    {loading ? t('downloading') || 'Downloading...' : t('download_excel_template') || 'Download Excel Template'}
                </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
                <div>
                    <label htmlFor="creationDate" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('creation_date') || 'Creation Date'}
                    </label>
                    <ReactDatePicker
                        wrapperClassName="w-full"
                        id="creationDate"
                        selected={creationDate}
                        onChange={(date) => setCreationDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholderText={t('select_date') || 'Select date'}
                        isClearable
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('address') || 'Address'}
                    </label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('enter_address') || 'Enter address'}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('select_excel_file') || 'Select Excel File'}
                    </label>
                    <FileDropZone
                        onFileSelect={setFile}
                        accept=".xlsx,.xls"
                        label={file ? `Selected file: ${file.name}` : t('drag_drop_or_click') || 'Drag & drop your file here, or click to select'}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-700 disabled:opacity-50 transition"
                >
                    {loading ? (t('uploading') || 'Uploading...') : (t('upload_excel_file') || 'Upload Excel File')}
                </button>

                {/* Success & error messages */}
                {uploadSuccess === true && (
                    <p className="text-green-600 font-semibold text-center mt-2">{t('upload_success') || 'File uploaded successfully!'}</p>
                )}
                {uploadSuccess === false && (
                    <p className="text-red-600 font-semibold text-center mt-2">{t('upload_failed') || 'Upload failed. Please try again.'}</p>
                )}

                {errorMessage && (
                    <p className="text-red-600 font-semibold text-center mt-2">{errorMessage}</p>
                )}
            </form>
        </div>
    );
};

export default UploadExcelPage;
