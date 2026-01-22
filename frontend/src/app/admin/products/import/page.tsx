'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface CsvPreview {
    columns: string[];
    suggestedMapping: Record<string, string>;
    preview: any[];
    totalRows: number;
}

interface Mapping {
    title: string;
    description: string;
    price: string;
    stock: string;
    images: string;
    category: string;
    sku: string;
}

export default function ProductImportPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Upload, 2: Mapping, 3: Preview, 4: Progress
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<CsvPreview | null>(null);
    const [mapping, setMapping] = useState<Mapping>({
        title: '',
        description: '',
        price: '',
        stock: '',
        images: '',
        category: '',
        sku: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<{ imported: number; errors: number } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const token = localStorage.getItem('admin_token') || '';
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const response = await fetch(`${apiUrl}/admin/products/import/parse`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to parse CSV');
            }

            const data = await response.json();
            setCsvData(data);
            setMapping(data.suggestedMapping);
            setStep(2);
        } catch (error) {
            console.error('Error parsing CSV:', error);
            alert(`Erreur lors de la lecture du fichier CSV : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMappingChange = (field: keyof Mapping, value: string) => {
        setMapping(prev => ({ ...prev, [field]: value }));
    };

    const handleExecuteImport = async () => {
        if (!csvData || !file) return;
        setIsLoading(true);
        setStep(4);
        setProgress(10);

        try {
            const token = localStorage.getItem('admin_token') || '';
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            // Re-parser le fichier localement pour tout envoyer
            setProgress(30);
            const allRecords = await parseCsvLocally(file);
            setProgress(50);

            const response = await fetch(`${apiUrl}/admin/products/import/execute`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    records: allRecords,
                    mapping: mapping,
                }),
            });

            if (!response.ok) throw new Error('Import failed');

            setProgress(90);
            const data = await response.json();
            setResult(data);
            setProgress(100);
        } catch (error) {
            console.error('Import error:', error);
            alert('Erreur lors de l\'importation');
            setStep(3); // Revenir à l'étape preview en cas d'erreur
        } finally {
            setIsLoading(false);
        }
    };

    const parseCsvLocally = (file: File): Promise<any[]> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                // Simple CSV parser for browser (handling quotes and commas)
                const records = parseCsvText(text);
                resolve(records);
            };
            reader.readAsText(file);
        });
    };

    const parseCsvText = (text: string): any[] => {
        const lines = text.split(/\r?\n/);
        if (lines.length === 0) return [];

        // Simple CSV splitter that respects quotes
        const splitLine = (line: string) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result.map(s => s.replace(/^"|"$/g, ''));
        };

        const headers = splitLine(lines[0]);
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = splitLine(lines[i]);
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index];
            });
            result.push(obj);
        }
        return result;
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-zinc-900 font-outfit">Importer des Produits CSV</h1>

            {/* Stepper */}
            <div className="flex mb-12">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-zinc-200 text-zinc-500'}`}>
                            {s}
                        </div>
                        {s < 4 && <div className={`h-1 flex-1 mx-4 rounded-full ${step > s ? 'bg-amber-600' : 'bg-zinc-200'}`}></div>}
                    </div>
                ))}
            </div>

            {/* Step 1: Upload */}
            {step === 1 && (
                <div className="bg-white border-2 border-dashed border-zinc-200 rounded-3xl p-16 text-center hover:border-amber-400 transition-colors group">
                    <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="mb-8 p-6 bg-zinc-50 w-24 h-24 rounded-2xl mx-auto group-hover:bg-amber-50 transition-colors">
                        <svg className="w-12 h-12 text-zinc-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-zinc-900">Uploader votre fichier WooCommerce CSV</h2>
                    <p className="text-zinc-500 mb-10 max-w-sm mx-auto">Glissez-déposez le fichier ici ou cliquez pour parcourir les dossiers de votre ordinateur.</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Lecture en cours...
                            </span>
                        ) : 'Choisir un fichier'}
                    </button>
                    <p className="mt-6 text-xs text-zinc-400 uppercase tracking-widest font-bold">Format accepté: CSV uniquement</p>
                </div>
            )}

            {/* Step 2: Mapping */}
            {step === 2 && csvData && (
                <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50">
                    <div className="p-8 border-b border-zinc-50 bg-zinc-50/50">
                        <h2 className="text-xl font-bold text-zinc-900">Mapper les colonnes</h2>
                        <p className="text-sm text-zinc-500">Reliez les colonnes de votre fichier aux champs de notre boutique.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 border-r border-zinc-100 space-y-6">
                            <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-wider mb-2">Champs de destination</h3>
                            {Object.keys(mapping).map((field) => (
                                <div key={field} className="group">
                                    <label className="block text-sm font-bold text-zinc-700 mb-2 capitalize group-focus-within:text-amber-600 transition-colors">
                                        {field === 'category' ? 'Collection / Catégorie' : field}
                                    </label>
                                    <select
                                        value={mapping[field as keyof Mapping] || ''}
                                        onChange={(e) => handleMappingChange(field as keyof Mapping, e.target.value)}
                                        className="w-full border border-zinc-200 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none bg-zinc-50 group-hover:bg-white"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.25rem' }}
                                    >
                                        <option value="">-- Ignorer ce champ --</option>
                                        {csvData.columns.map(col => (
                                            <option key={col} value={col}>{col}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-zinc-50/30">
                            <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-wider mb-6">Aperçu des données sourcées</h3>
                            <div className="space-y-4">
                                {csvData.preview.map((row, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm text-xs truncate">
                                        {csvData.columns.slice(0, 4).map(col => (
                                            <div key={col} className="flex justify-between mb-1 last:mb-0">
                                                <span className="text-zinc-400 font-medium">{col}:</span>
                                                <span className="text-zinc-600 font-bold truncate ml-4">{row[col]}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div className="text-center pt-4">
                                    <p className="text-xs text-zinc-400 italic">Affichage des 5 premières lignes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white border-t border-zinc-100 flex justify-end gap-4">
                        <button
                            onClick={() => setStep(1)}
                            className="px-8 py-3 text-zinc-500 font-bold hover:text-zinc-900 transition-colors"
                        >
                            Retour
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className="bg-zinc-900 text-white px-10 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200"
                        >
                            Vérifier l'import
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
                <div className="bg-white border border-zinc-100 rounded-3xl p-12 text-center shadow-xl shadow-zinc-100">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-zinc-900">Confirmation finale</h2>
                    <p className="text-zinc-500 mb-10 max-w-md mx-auto text-lg">
                        Vous êtes sur le point d'importer <span className="text-amber-600 font-bold">{csvData?.totalRows}</span> produits avec la configuration que vous venez de définir.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-10 text-left max-w-md mx-auto">
                        <div className="bg-zinc-50 p-4 rounded-2xl">
                            <p className="text-xs text-zinc-400 uppercase font-bold mb-1">Fichier</p>
                            <p className="text-zinc-700 font-bold truncate">{file?.name}</p>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-2xl">
                            <p className="text-xs text-zinc-400 uppercase font-bold mb-1">Champs mappés</p>
                            <p className="text-zinc-700 font-bold">{Object.values(mapping).filter(v => v !== '').length} / {Object.keys(mapping).length}</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => setStep(2)}
                            className="px-8 py-3 text-zinc-500 font-bold hover:text-zinc-900"
                        >
                            Modifier le mapping
                        </button>
                        <button
                            onClick={handleExecuteImport}
                            disabled={isLoading}
                            className="bg-amber-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-amber-700 transition-all active:scale-95 shadow-xl shadow-amber-200 disabled:opacity-50"
                        >
                            {isLoading ? 'Lancement...' : 'Importer maintenant'}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Progress & Results */}
            {step === 4 && (
                <div className="bg-white border border-zinc-100 rounded-3xl p-20 text-center shadow-xl shadow-zinc-100">
                    {isLoading || progress < 100 ? (
                        <>
                            <div className="mb-12 max-w-lg mx-auto">
                                <div className="flex mb-4 items-center justify-between">
                                    <span className="text-sm font-bold text-amber-600 uppercase tracking-widest">Importation en cours...</span>
                                    <span className="text-2xl font-black text-amber-600">{progress}%</span>
                                </div>
                                <div className="overflow-hidden h-4 rounded-full bg-zinc-100 p-1">
                                    <div
                                        style={{ width: `${progress}%` }}
                                        className="h-full rounded-full bg-amber-500 transition-all duration-700 ease-out shadow-inner"
                                    ></div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-zinc-900 mb-3 animate-pulse">Ne fermez pas cette page</h2>
                            <p className="text-zinc-500">Nous traitons vos {csvData?.totalRows} produits et téléchargeons les images associées.</p>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100 border-4 border-white">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-black text-zinc-900 mb-4">Succès !</h2>
                            <p className="text-zinc-500 mb-12 text-lg max-w-md mx-auto">
                                <span className="text-zinc-900 font-bold">{result?.imported}</span> produits ont été injectés dans votre base de données avec succès.
                                {result?.errors && result.errors > 0 && (
                                    <span className="block mt-2 text-red-500 font-medium">({result.errors} produits ont rencontré une erreur)</span>
                                )}
                            </p>
                            <div className="flex justify-center gap-6">
                                <button
                                    onClick={() => router.push('/admin/products')}
                                    className="bg-zinc-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-zinc-200"
                                >
                                    Consulter la boutique
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-10 py-4 border border-zinc-200 rounded-2xl font-bold text-zinc-600 hover:bg-zinc-50 transition-all"
                                >
                                    Nouvel import
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
