import React from 'react';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-jungle-900 px-4">
            <div className="max-w-md w-full text-center space-y-8 p-10 bg-jungle-800 rounded-2xl border border-vanilla-400/20 shadow-2xl">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-vanilla-400 rounded-full flex items-center justify-center animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-jungle-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-4xl font-serif font-bold text-vanilla-400">
                    Maintenance en cours
                </h1>

                <p className="text-vanilla-200 text-lg leading-relaxed">
                    Nous mettons à jour les prix de notre boutique pour vous offrir la meilleure expérience possible.
                    Revenez très bientôt !
                </p>

                <div className="pt-4">
                    <p className="text-vanilla-400/60 text-sm italic">
                        M.S.V-NOSY BE — Vanille de Madagascar
                    </p>
                </div>
            </div>
        </div>
    );
}
